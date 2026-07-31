"use client";

import Card from "@/components/ui/Card";
import type { Statement } from "@/services/statements/types";

type Props = {
  statement: Statement;
};

export default function StatementLedger({
  statement,
}: Props) {

  return (

    <Card>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="py-3 text-left">
              Date
            </th>

            <th className="text-left">
              Description
            </th>

            <th className="text-right">
              Debit
            </th>

            <th className="text-right">
              Credit
            </th>

            <th className="text-right">
              Balance
            </th>

          </tr>

        </thead>

        <tbody>

          {statement.transactions.map((row) => (

            <tr
              key={row.id}
              className="border-b"
            >

              <td className="py-3">
                {row.date}
              </td>

              <td>
                {row.description}
              </td>

              <td className="text-right">
                {row.debit
                  ? row.debit.toLocaleString()
                  : "-"}
              </td>

              <td className="text-right">
                {row.credit
                  ? row.credit.toLocaleString()
                  : "-"}
              </td>

              <td className="text-right font-semibold">
                {row.balance.toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </Card>

  );

}
