"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function StatementFilters() {

  return (

    <Card>

      <div className="grid gap-4 md:grid-cols-4">

        <select className="rounded-lg border p-3">
          <option>Select Tenant</option>
        </select>

        <select className="rounded-lg border p-3">
          <option>Select Property</option>
        </select>

        <input
          type="date"
          className="rounded-lg border p-3"
        />

        <Button>
          Generate
        </Button>

      </div>

    </Card>

  );

}
