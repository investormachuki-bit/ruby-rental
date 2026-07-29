import { createPayment } from "./createPayment";
import { reconcilePayment } from "./reconcilePayment";

import { logAudit } from "@/services/audit";
import { sendNotification } from "@/services/notifications";

export async function receivePayment(
  input: Parameters<typeof createPayment>[0]
) {

  const {
    payment,
    receipt,
    reconciliation,
  } = await createPayment(input);

  await logAudit(

    "Payments",

    "CREATE",

    "Payment",

    payment.id,

    `Received ${input.payment_type} payment of ${input.amount}`

  );

  // Notification integration
  // (Tenant contact lookup will be added later.)

  return {

    payment,

    receipt,

    reconciliation,

  };

}
