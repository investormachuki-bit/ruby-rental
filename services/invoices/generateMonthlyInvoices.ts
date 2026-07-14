import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";
import { createInvoice } from "@/services/invoices/createInvoice";
import { createInvoiceItem } from "@/services/invoiceItems/createInvoiceItem";

export async function generateMonthlyInvoices() {

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  const profile =
    await getProfile(session.user.id);

  if (!profile) {
    throw new Error("Profile not found.");
  }

  const today = new Date();

  const monthName =
    today.toLocaleString("default", {
      month: "long",
    });

  const billingPeriod =
    `${monthName} ${today.getFullYear()}`;

  const invoiceDate =
    today
      .toISOString()
      .split("T")[0];

  const { data: leases, error } =
    await supabase
      .from("leases")
      .select(`
        *,
        property:properties(id),
        unit:units(id),
        occupant:occupants(id)
      `)
      .eq(
        "workspace_id",
        profile.workspace_id
      )
      .eq(
        "status",
        "Active"
      );

  if (error) {
    throw error;
  }

  if (!leases?.length) {

    return {
      generated: 0,
    };

  }

  let generated = 0;

  for (const lease of leases) {

    const dueDay =
      lease.rent_due_day ?? 1;

    // Skip until the configured billing day
    if (
      today.getDate() < dueDay
    ) {
      continue;
    }

    // Prevent duplicate monthly invoices
    const { data: existing } =
      await supabase
        .from("invoices")
        .select("id")
        .eq(
          "lease_id",
          lease.id
        )
        .eq(
          "invoice_type",
          "Rent"
        )
        .eq(
          "billing_period",
          billingPeriod
        )
        .maybeSingle();

    if (existing) {
      continue;
    }

    // Create invoice header
    const invoice =
      await createInvoice({

        lease_id:
          lease.id,

        property_id:
          lease.property_id,

        unit_id:
          lease.unit_id,

        occupant_id:
          lease.occupant_id,

        invoice_type:
          "Rent",

        billing_period:
          billingPeriod,

        invoice_date:
          invoiceDate,

        due_date:
          invoiceDate,

        notes:
          `Automatic monthly rent invoice for ${billingPeriod}`,

      });

    // Add Rent line item
    await createInvoiceItem({

      invoice_id:
        invoice.id,

      item_type:
        "Rent",

      description:
        `${billingPeriod} Rent`,

      quantity: 1,

      unit_price:
        Number(
          lease.rent_amount
        ),

    });

    generated++;

  }

  return {

    generated,

  };

}
