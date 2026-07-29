import { createPayment } from "./createPayment";
import { reconcilePayment } from "./reconcilePayment";

import { createReceipt } from "@/services/receipts/createReceipt";
import { createTenantCredit } from "@/services/payments/tenantCredits";

import { logAudit } from "@/services/audit";
import { sendNotification } from "@/services/notifications";

export async function receivePayment(
  input: Parameters<typeof createPayment>[0]
) {

  /*
  |--------------------------------------------------------------------------
  | Step 1
  | Create Payment
  |--------------------------------------------------------------------------
  */

  const {
    payment,
    workspaceId,
    userId,
  } = await createPayment(input);

  /*
  |--------------------------------------------------------------------------
  | Step 2
  | Reconcile Payment
  |--------------------------------------------------------------------------
  */

  const reconciliation =
    await reconcilePayment({

      paymentId:
        payment.id,

      workspaceId,

      leaseId:
        input.lease_id,

      amount:
        input.amount,

      mode:
        "auto",

    });

  /*
  |--------------------------------------------------------------------------
  | Step 3
  | Create Tenant Credit (Overpayment)
  |--------------------------------------------------------------------------
  */

  if (
    reconciliation.unallocated_amount > 0
  ) {

    await createTenantCredit({

      workspaceId,

      tenantId:
        input.tenant_id,

      paymentId:
        payment.id,

      amount:
        reconciliation.unallocated_amount,

      notes:
        `Automatic credit created from payment ID ${payment.id}`,

    });

  }

  /*
  |--------------------------------------------------------------------------
  | Step 4
  | Generate Receipt
  |--------------------------------------------------------------------------
  */

  const receipt =
    await createReceipt({

      payment_id:
        payment.id,

      amount:
        input.amount,

      receipt_date:
        input.payment_date,

      notes:
        input.notes,

    });

  /*
  |--------------------------------------------------------------------------
  | Step 5
  | Audit
  |--------------------------------------------------------------------------
  */

  await logAudit(

    "Payments",

    "CREATE",

    "Payment",

    payment.id,

    `Received ${input.payment_type} payment of ${input.amount}`

  );

  /*
  |--------------------------------------------------------------------------
  | Step 6
  | Notifications
  |--------------------------------------------------------------------------
  | TODO:
  | Lookup tenant contact and send email/SMS/WhatsApp
  */

  // await sendNotification(...);

  /*
  |--------------------------------------------------------------------------
  | Step 7
  | Future Automation Hooks
  |--------------------------------------------------------------------------
  */

  // triggerAutomation(...);

  return {

    payment,

    receipt,

    reconciliation,

  };

}
