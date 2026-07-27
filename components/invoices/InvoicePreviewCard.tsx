"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

import type {
  InvoiceBuildResult,
} from "@/services/billing/types";

type Props = {
  invoice: InvoiceBuildResult | null;
  onGenerate?: () => void;
  generating?: boolean;
};

export default function InvoicePreviewCard({
  invoice,
  onGenerate,
  generating = false,
}: Props) {

  if (!invoice) {
    return (
      <Card>
        <div className="py-12 text-center text-gray-500">
          Select a property and unit to preview the invoice.
        </div>
      </Card>
    );
  }

  return (
    <Card>

      <h2 className="mb-6 text-xl font-bold">
        Invoice Preview
      </h2>

      <div className="space-y-4">

        {invoice.items.map(
          (item, index) => (

            <div
              key={index}
              className="flex items-center justify-between border-b pb-3"
            >

              <div>

                <p className="font-medium">
                  {item.item_type}
                </p>

                <p className="text-sm text-gray-500">
                  {item.description}
                </p>

              </div>

              <div className="font-semibold">

                KES{" "}
                {(
                  item.quantity *
                  item.unit_price
                ).toLocaleString()}

              </div>

            </div>

          )
        )}

      </div>

      <div className="mt-8 space-y-3 border-t pt-6">

        <div className="flex justify-between">
          <span>Rent</span>

          <strong>
            KES{" "}
            {invoice.rent_total.toLocaleString()}
          </strong>
        </div>

        <div className="flex justify-between">
          <span>Utilities & Charges</span>

          <strong>
            KES{" "}
            {invoice.utility_charges.toLocaleString()}
          </strong>
        </div>

        <div className="flex justify-between">
          <span>Previous Balance</span>

          <strong>
            KES{" "}
            {invoice.previous_balances.toLocaleString()}
          </strong>
        </div>

        <div className="flex justify-between border-t pt-4 text-xl font-bold">

          <span>Total</span>

          <span>
            KES{" "}
            {invoice.total.toLocaleString()}
          </span>

        </div>

      </div>

      <div className="mt-8 flex justify-end gap-3">

        <Button
          variant="primary"
          disabled={
            !onGenerate ||
            generating
          }
          onClick={onGenerate}
        >
          {generating
            ? "Generating..."
            : "Generate Invoice"}
        </Button>

      </div>

    </Card>
  );
}
