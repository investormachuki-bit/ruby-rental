import { getReceipt } from "@/services/receipts/getReceipt";
import { getReceiptPayment } from "@/services/receipts/getReceiptPayment";
import { getReceiptParties } from "@/services/receipts/getReceiptParties";
import { buildReceiptPdf } from "./buildReceiptPdf";

export async function downloadReceiptPdf(receiptId: string) {
  const receipt = await getReceipt(receiptId);
  const payment = await getReceiptPayment(receipt.payment_id);
  const parties = await getReceiptParties(
    payment.tenant_id,
    payment.property_id,
    payment.unit_id
  );

  const pdf = await buildReceiptPdf({
    ...receipt,
    payment,
    ...parties,
  });

  pdf.save(`${receipt.receipt_number || "receipt"}.pdf`);
}
