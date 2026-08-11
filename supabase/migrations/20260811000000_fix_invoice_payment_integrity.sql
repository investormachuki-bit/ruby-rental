/*
============================================================
Ruby Rental
Invoice & Payment Integrity Fix
============================================================

Rules:
1. Invoice amount comes from invoice_items.
2. Payments cannot allocate to Cancelled invoices.
3. Cancelled invoices remain Cancelled.
4. Invoice balance cannot go below zero.
5. Payment allocation derives amount_paid and balance
   from payment_allocations.
============================================================
*/

BEGIN;


/*
============================================================
1. RECALCULATE INVOICE TOTALS
============================================================
*/

CREATE OR REPLACE FUNCTION public.recalculate_invoice_totals(
    invoice_uuid uuid
)
RETURNS void
LANGUAGE plpgsql
AS $function$

DECLARE
    v_total numeric(12,2);
    v_paid numeric(12,2);
    v_status text;

BEGIN

    SELECT
        COALESCE(SUM(amount), 0)
    INTO v_total
    FROM invoice_items
    WHERE invoice_id = invoice_uuid;


    SELECT
        COALESCE(SUM(allocated_amount), 0)
    INTO v_paid
    FROM payment_allocations
    WHERE invoice_id = invoice_uuid;


    SELECT status
    INTO v_status
    FROM invoices
    WHERE id = invoice_uuid;


    IF v_status = 'Cancelled' THEN
        RETURN;
    END IF;


    UPDATE invoices
    SET
        amount = ROUND(v_total, 2),

        amount_paid = LEAST(
            ROUND(v_paid, 2),
            ROUND(v_total, 2)
        ),

        balance = GREATEST(
            ROUND(v_total - v_paid, 2),
            0
        ),

        status =
            CASE
                WHEN v_total <= 0 THEN
                    'Draft'

                WHEN v_paid >= v_total THEN
                    'Paid'

                WHEN v_paid > 0 THEN
                    'Partially Paid'

                ELSE
                    'Issued'
            END,

        updated_at = NOW()

    WHERE id = invoice_uuid
      AND status <> 'Cancelled';

END;

$function$;


/*
============================================================
2. PAYMENT ALLOCATION — LEASE VERSION
============================================================
This is the version currently called by reconcilePayment().
============================================================
*/

CREATE OR REPLACE FUNCTION public.allocate_payment_to_invoices(
    p_workspace_id uuid,
    p_payment_id uuid,
    p_lease_id uuid,
    p_amount numeric
)
RETURNS void
LANGUAGE plpgsql
AS $function$

DECLARE
    remaining_amount numeric := GREATEST(p_amount, 0);
    inv record;
    allocation numeric;

BEGIN

    IF remaining_amount <= 0 THEN
        RETURN;
    END IF;


    FOR inv IN
        SELECT
            id,
            balance
        FROM invoices
        WHERE workspace_id = p_workspace_id
          AND lease_id = p_lease_id
          AND balance > 0
          AND status <> 'Cancelled'
        ORDER BY
            due_date ASC NULLS LAST,
            created_at ASC

    LOOP

        EXIT WHEN remaining_amount <= 0;


        allocation :=
            LEAST(
                remaining_amount,
                inv.balance
            );


        IF allocation <= 0 THEN
            CONTINUE;
        END IF;


        INSERT INTO payment_allocations (
            workspace_id,
            payment_id,
            invoice_id,
            allocated_amount
        )
        VALUES (
            p_workspace_id,
            p_payment_id,
            inv.id,
            allocation
        );


        PERFORM public.recalculate_invoice_totals(
            inv.id
        );


        remaining_amount :=
            remaining_amount - allocation;

    END LOOP;

END;

$function$;


/*
============================================================
3. PAYMENT ALLOCATION — WORKSPACE VERSION
============================================================
Keep the overloaded function safe too.
============================================================
*/

CREATE OR REPLACE FUNCTION public.allocate_payment_to_invoices(
    p_workspace_id uuid,
    p_payment_id uuid,
    p_amount numeric
)
RETURNS void
LANGUAGE plpgsql
AS $function$

DECLARE
    remaining_amount numeric := GREATEST(p_amount, 0);
    inv record;
    allocation numeric;

BEGIN

    IF remaining_amount <= 0 THEN
        RETURN;
    END IF;


    FOR inv IN
        SELECT
            id,
            balance
        FROM invoices
        WHERE workspace_id = p_workspace_id
          AND balance > 0
          AND status <> 'Cancelled'
        ORDER BY
            due_date ASC NULLS LAST,
            created_at ASC

    LOOP

        EXIT WHEN remaining_amount <= 0;


        allocation :=
            LEAST(
                remaining_amount,
                inv.balance
            );


        IF allocation <= 0 THEN
            CONTINUE;
        END IF;


        INSERT INTO payment_allocations (
            workspace_id,
            payment_id,
            invoice_id,
            allocated_amount
        )
        VALUES (
            p_workspace_id,
            p_payment_id,
            inv.id,
            allocation
        );


        PERFORM public.recalculate_invoice_totals(
            inv.id
        );


        remaining_amount :=
            remaining_amount - allocation;

    END LOOP;

END;

$function$;


/*
============================================================
4. REBUILD EXISTING ACTIVE INVOICE TOTALS
============================================================
Cancelled invoices are intentionally untouched.
============================================================
*/

DO $$

DECLARE
    invoice_record record;

BEGIN

    FOR invoice_record IN
        SELECT id
        FROM invoices
        WHERE status <> 'Cancelled'
    LOOP

        PERFORM public.recalculate_invoice_totals(
            invoice_record.id
        );

    END LOOP;

END;

$$;


COMMIT;
