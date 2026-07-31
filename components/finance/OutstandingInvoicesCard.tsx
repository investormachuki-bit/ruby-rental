"use client";

import Card from "@/components/ui/Card";

type Invoice = {
  id: string;
  invoice_number: string;
  tenant_name?: string | null;
  due_date?: string | null;
  balance: number;
};

type Props = {
  invoices: Invoice[];
  loading?: boolean;
};

function formatCurrency(value: number) {
  return `KES ${value.toLocaleString()}`;
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString();
}

function getStatus(dueDate?: string | null) {
  if (!dueDate) {
    return {
      label: "Unknown",
      className: "bg-gray-100 text-gray-600",
    };
  }

  const today = new Date();
  const due = new Date(dueDate);

  if (due < today) {
    return {
      label: "Overdue",
      className: "bg-red-100 text-red-600",
    };
  }

  const days =
    (due.getTime() - today.getTime()) /
    (1000 * 60 * 60 * 24);

  if (days <= 7) {
    return {
      label: "Due Soon",
      className: "bg-yellow-100 text-yellow-700",
    };
  }

  return {
    label: "Open",
    className: "bg-green-100 text-green-700",
  };
}

export default function OutstandingInvoicesCard({
  invoices,
  loading = false,
}: Props) {
  return (
    <Card>

      <div className="mb-5">

        <h2 className="text-xl font-bold">
          Outstanding Invoices
        </h2>

        <p className="text-sm text-gray-500">
          Invoices awaiting payment
        </p>

      </div>

      {loading ? (

        <div className="flex h-64 items-center justify-center">

          Loading...

        </div>

      ) : invoices.length === 0 ? (

        <div className="flex h-64 items-center justify-center text-gray-400">

          No outstanding invoices.

        </div>

      ) : (

        <div className="space-y-3">

          {invoices.map((invoice) => {

            const status =
              getStatus(invoice.due_date);

            return (

              <div
                key={invoice.id}
                className="rounded-xl border p-4 hover:bg-gray-50 transition"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <p className="font-semibold">

                      {invoice.invoice_number}

                    </p>

                    <p className="text-sm text-gray-500">

                      {invoice.tenant_name}

                    </p>

                    <p className="text-xs text-gray-400">

                      Due:
                      {" "}
                      {formatDate(invoice.due_date)}

                    </p>

                  </div>

                  <div className="text-right">

                    <p className="font-bold text-red-600">

                      {formatCurrency(invoice.balance)}

                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </Card>
  );
}
