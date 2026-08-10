"use client";

import Card from "@/components/ui/Card";
import { useState } from "react";
import { getReceiptByPaymentId } from "@/services/receipts/getReceiptByPaymentId";
import { getReceiptPayment } from "@/services/receipts/getReceiptPayment";
import { getReceiptParties } from "@/services/receipts/getReceiptParties";
import { buildReceiptPdf } from "@/services/receipts/pdf/buildReceiptPdf";
import { shareDocument } from "@/services/sharing/shareDocument";

import {
  Wallet,
  CreditCard,
  Banknote,
  Landmark,
  Receipt,
  Download,
  Printer,
  Share2,
  Mail,
  MessageCircle,
} from "lucide-react";

type Payment = {
  id: string;
  receipt_number?: string;
  payment_date: string;
  payment_method: string;
  reference_number?: string;
  amount: number;
};

type Props = {
  payments: Payment[];
  invoiceAmount: number;
  amountPaid: number;
  balance: number;
  currency?: string;
};

function paymentIcon(method: string) {
  switch (method) {
    case "Cash":
      return Banknote;
    case "Bank":
    case "Cheque":
      return Landmark;
    case "M-Pesa":
      return Wallet;
    case "Card":
      return CreditCard;
    default:
      return Receipt;
  }
}

export default function InvoicePaymentsTable({
  payments,
  invoiceAmount,
  amountPaid,
  balance,
  currency = "KES",
}: Props) {
  const [working, setWorking] = useState<string | null>(null);

  async function getReceiptDocument(paymentId: string) {
    const receipt = await getReceiptByPaymentId(paymentId);

    if (!receipt) {
      throw new Error("Receipt not found for this payment.");
    }

    const payment = await getReceiptPayment(paymentId);

    const parties = await getReceiptParties(
      payment.tenant_id,
      payment.property_id,
      payment.unit_id
    );

    const pdf = await buildReceiptPdf({
      payment,
      tenant: parties.tenant,
      property: parties.property,
      unit: parties.unit,
      receipt_number:
        payment.receipt_number ??
        receipt.receipt_number,
      receipt_date: payment.payment_date,
      amount: payment.amount,
      notes: payment.notes,
    });

    return {
      receipt,
      payment,
      parties,
      pdf,
      fileName: `${payment.receipt_number ?? receipt.receipt_number ?? "receipt"}.pdf`,
    };
  }

  async function handleDownload(paymentId: string) {
    try {
      setWorking(paymentId);

      const { pdf, fileName } =
        await getReceiptDocument(paymentId);

      pdf.save(fileName);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to download receipt."
      );
    } finally {
      setWorking(null);
    }
  }

  async function handlePrint(paymentId: string) {
    try {
      setWorking(paymentId);

      const { pdf } =
        await getReceiptDocument(paymentId);

      const url = pdf.output("bloburl");
      const printWindow = window.open(
        url,
        "_blank"
      );

      if (!printWindow) {
        throw new Error(
          "Popup blocked. Please allow popups to print the receipt."
        );
      }
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to print receipt."
      );
    } finally {
      setWorking(null);
    }
  }

  async function handleShare(paymentId: string) {
    try {
      setWorking(paymentId);

      const {
        payment,
        parties,
        pdf,
        fileName,
      } = await getReceiptDocument(paymentId);

      const tenantName =
        parties.tenant?.full_name ||
        `${parties.tenant?.first_name ?? ""} ${
          parties.tenant?.last_name ?? ""
        }`.trim() ||
        "Tenant";

      const message =
        `Dear ${tenantName},\n\n` +
        `Please find your payment receipt ` +
        `${payment.receipt_number ?? "for your payment"} ` +
        `for ${currency} ${Number(
          payment.amount ?? 0
        ).toLocaleString("en-KE", {
          minimumFractionDigits: 2,
        })}, received on ${payment.payment_date}.\n\n` +
        `Thank you.`;

      const blob = pdf.output("blob");

      await shareDocument({
        blob,
        fileName,
        title: `Payment Receipt ${payment.receipt_number ?? ""}`,
        message,
        phone: parties.tenant?.phone,
        email: parties.tenant?.email,
      });
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to share receipt."
      );
    } finally {
      setWorking(null);
    }
  }

  async function handleEmail(paymentId: string) {
    try {
      setWorking(paymentId);

      const {
        payment,
        parties,
        pdf,
        fileName,
      } = await getReceiptDocument(paymentId);

      const tenantName =
        parties.tenant?.full_name ||
        `${parties.tenant?.first_name ?? ""} ${
          parties.tenant?.last_name ?? ""
        }`.trim() ||
        "Tenant";

      const message =
        `Dear ${tenantName},\n\n` +
        `Please find your payment receipt ` +
        `${payment.receipt_number ?? ""} ` +
        `for ${currency} ${Number(
          payment.amount ?? 0
        ).toLocaleString("en-KE", {
          minimumFractionDigits: 2,
        })}, received on ${payment.payment_date}.\n\n` +
        `Thank you.`;

      const blob = pdf.output("blob");

      await shareDocument({
        blob,
        fileName,
        title: `Payment Receipt ${payment.receipt_number ?? ""}`,
        message,
        email: parties.tenant?.email,
      });
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to prepare email."
      );
    } finally {
      setWorking(null);
    }
  }

  async function handleWhatsApp(paymentId: string) {
    try {
      setWorking(paymentId);

      const {
        payment,
        parties,
        pdf,
        fileName,
      } = await getReceiptDocument(paymentId);

      const tenantName =
        parties.tenant?.full_name ||
        `${parties.tenant?.first_name ?? ""} ${
          parties.tenant?.last_name ?? ""
        }`.trim() ||
        "Tenant";

      const message =
        `Dear ${tenantName},\n\n` +
        `Please find your payment receipt ` +
        `${payment.receipt_number ?? ""} ` +
        `for ${currency} ${Number(
          payment.amount ?? 0
        ).toLocaleString("en-KE", {
          minimumFractionDigits: 2,
        })}, received on ${payment.payment_date}.\n\n` +
        `Thank you.`;

      const blob = pdf.output("blob");

      await shareDocument({
        blob,
        fileName,
        title: `Payment Receipt ${payment.receipt_number ?? ""}`,
        message,
        phone: parties.tenant?.phone,
      });
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Unable to prepare WhatsApp message."
      );
    } finally {
      setWorking(null);
    }
  }

  return (
    <Card>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">
            Payment History
          </h2>

          <p className="text-sm text-gray-500">
            Payments allocated to this invoice.
          </p>
        </div>

        <div className="rounded-xl bg-green-50 px-4 py-3">
          <p className="text-xs uppercase text-gray-500">
            Total Paid
          </p>

          <p className="text-xl font-bold text-green-600">
            {currency}{" "}
            {amountPaid.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-left">
                Receipt
              </th>

              <th className="px-4 py-3 text-left">
                Date
              </th>

              <th className="px-4 py-3 text-left">
                Method
              </th>

              <th className="px-4 py-3 text-left">
                Reference
              </th>

              <th className="px-4 py-3 text-right">
                Amount
              </th>

              <th className="px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="py-12 text-center text-gray-500"
                >
                  No payments have been received.
                </td>
              </tr>
            )}

            {payments.map((payment) => {
              const Icon =
                paymentIcon(
                  payment.payment_method
                );

              const isWorking =
                working === payment.id;

              return (
                <tr
                  key={payment.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-4 font-medium">
                    {payment.receipt_number ?? "-"}
                  </td>

                  <td className="px-4 py-4">
                    {payment.payment_date}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-gray-500" />
                      {payment.payment_method}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {payment.reference_number ?? "-"}
                  </td>

                  <td className="px-4 py-4 text-right font-semibold text-green-600">
                    {currency}{" "}
                    {Number(
                      payment.amount
                    ).toLocaleString()}
                  </td>

                  <td className="px-4 py-4">
                    {payment.receipt_number && (
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            handleDownload(payment.id)
                          }
                          disabled={isWorking}
                          title="Download Receipt"
                          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                        >
                          <Download className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handlePrint(payment.id)
                          }
                          disabled={isWorking}
                          title="Print Receipt"
                          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                        >
                          <Printer className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleShare(payment.id)
                          }
                          disabled={isWorking}
                          title="Share Receipt"
                          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleEmail(payment.id)
                          }
                          disabled={isWorking}
                          title="Email Receipt"
                          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                        >
                          <Mail className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleWhatsApp(payment.id)
                          }
                          disabled={isWorking}
                          title="WhatsApp Receipt"
                          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
