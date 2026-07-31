"use client";

import Card from "@/components/ui/Card";
import type { Statement } from "@/services/statements/types";

type Props = {
  statement: Statement;
};

export default function StatementSummary({
  statement,
}: Props) {

  const credits =
    statement.transactions.reduce(
      (sum, item) => sum + item.credit,
      0
    );

  return (

    <div className="grid gap-4 md:grid-cols-3">

      <Card>

        <p className="text-sm text-gray-500">
          Opening Balance
        </p>

        <h2 className="text-2xl font-bold">
          KSh {statement.openingBalance.toLocaleString()}
        </h2>

      </Card>

      <Card>

        <p className="text-sm text-gray-500">
          Total Credits
        </p>

        <h2 className="text-2xl font-bold">
          KSh {credits.toLocaleString()}
        </h2>

      </Card>

      <Card>

        <p className="text-sm text-gray-500">
          Closing Balance
        </p>

        <h2 className="text-2xl font-bold">
          KSh {statement.closingBalance.toLocaleString()}
        </h2>

      </Card>

    </div>

  );

}
