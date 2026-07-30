"use client";

import Card from "@/components/ui/Card";

import {
  Wallet,
  CreditCard,
  Banknote,
  Landmark,
  Receipt,
} from "lucide-react";

type Payment = {
  id: string;

  receipt_number?: string;

  payment_date: string;

  payment_method: string;

  reference_number?: string;

  amount: number;

  notes?: string;
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
      return Landmark;

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

            </tr>

          </thead>

          <tbody>

            {payments.length === 0 && (

              <tr>

                <td
                  colSpan={5}
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

              return (

                <tr
                  key={payment.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="px-4 py-4 font-medium">

                    {payment.receipt_number ??
                      "-"}

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

                    {payment.reference_number ??
                      "-"}

                  </td>

                  <td className="px-4 py-4 text-right font-semibold text-green-600">

                    {currency}{" "}

                    {Number(
                      payment.amount
                    ).toLocaleString()}

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">

        <div className="rounded-xl bg-gray-50 p-4">

          <p className="text-sm text-gray-500">

            Invoice Amount

          </p>

          <p className="mt-2 text-2xl font-bold">

            {currency}{" "}

            {invoiceAmount.toLocaleString()}

          </p>

        </div>

        <div className="rounded-xl bg-green-50 p-4">

          <p className="text-sm text-gray-500">

            Paid

          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">

            {currency}{" "}

            {amountPaid.toLocaleString()}

          </p>

        </div>

        <div className="rounded-xl bg-red-50 p-4">

          <p className="text-sm text-gray-500">

            Balance

          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">

            {currency}{" "}

            {balance.toLocaleString()}

          </p>

        </div>

      </div>

    </Card>
  );
}
