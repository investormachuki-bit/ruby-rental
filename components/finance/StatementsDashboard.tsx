"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const statements = [
  "Tenant Statement",
  "Property Statement",
  "Unit Statement",
  "Account Statement",
];

export default function StatementsDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2">

      {statements.map((item) => (

        <Card key={item}>

          <h2 className="text-xl font-semibold">
            {item}
          </h2>

          <p className="mt-2 text-gray-500">
            Generate a printable statement.
          </p>

          <div className="mt-6 flex gap-3">

            <Button>
              PDF
            </Button>

            <Button variant="secondary">
              Excel
            </Button>

          </div>

        </Card>

      ))}

    </div>
  );
}
