"use client";

import Card from "@/components/ui/Card";

import {
  ReceiptText,
} from "lucide-react";

type InvoiceItem = {
  id: string;

  item_type: string;

  description: string;

  quantity: number;

  unit_price: number;

  amount: number;
};

type Props = {
  items: InvoiceItem[];

  currency?: string;
};

export default function InvoiceItemsTable({
  items,
  currency = "KES",
}: Props) {

  const subtotal =
    items.reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );

  return (

    <Card>

      <div className="mb-6 flex items-center gap-3">

        <div className="rounded-xl bg-amber-50 p-3">

          <ReceiptText className="h-6 w-6 text-amber-600" />

        </div>

        <div>

          <h2 className="text-xl font-bold">

            Invoice Charges

          </h2>

          <p className="text-sm text-gray-500">

            Charges included in this invoice.

          </p>

        </div>

      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead>

            <tr className="border-b bg-gray-50">

              <th className="px-4 py-4 text-left text-sm font-semibold">

                #

              </th>

              <th className="px-4 py-4 text-left text-sm font-semibold">

                Charge

              </th>

              <th className="px-4 py-4 text-left text-sm font-semibold">

                Description

              </th>

              <th className="px-4 py-4 text-center text-sm font-semibold">

                Qty

              </th>

              <th className="px-4 py-4 text-right text-sm font-semibold">

                Unit Price

              </th>

              <th className="px-4 py-4 text-right text-sm font-semibold">

                Amount

              </th>

            </tr>

          </thead>

          <tbody>

            {items.length === 0 && (

              <tr>

                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-500"
                >

                  No invoice items found.

                </td>

              </tr>

            )}

            {items.map((item, index) => (

              <tr
                key={item.id}
                className="border-b transition hover:bg-gray-50"
              >

                <td className="px-4 py-4">

                  {index + 1}

                </td>

                <td className="px-4 py-4">

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">

                    {item.item_type}

                  </span>

                </td>

                <td className="px-4 py-4">

                  <div>

                    <p className="font-medium">

                      {item.description}

                    </p>

                  </div>

                </td>

                <td className="px-4 py-4 text-center">

                  {item.quantity}

                </td>

                <td className="px-4 py-4 text-right font-medium">

                  {currency}{" "}

                  {Number(
                    item.unit_price
                  ).toLocaleString()}

                </td>

                <td className="px-4 py-4 text-right font-semibold">

                  {currency}{" "}

                  {Number(
                    item.amount
                  ).toLocaleString()}

                </td>

              </tr>

            ))}

          </tbody>

          <tfoot>

            <tr>

              <td
                colSpan={5}
                className="border-t px-4 py-5 text-right text-lg font-bold"
              >

                Subtotal

              </td>

              <td className="border-t px-4 py-5 text-right text-xl font-bold text-amber-700">

                {currency}{" "}

                {subtotal.toLocaleString()}

              </td>

            </tr>

          </tfoot>

        </table>

      </div>

    </Card>

  );

}
