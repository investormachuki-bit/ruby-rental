"use client";

import Card from "@/components/ui/Card";

type Payment = {
  id: string;
  reference_number?: string | null;
  payment_date?: string | null;
  tenant_name?: string | null;
  payment_method?: string | null;
  amount: number;
};

type Props = {
  payments: Payment[];
  loading?: boolean;
};

function formatCurrency(value: number) {
  return `KES ${value.toLocaleString()}`;
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString();
}

export default function RecentPaymentsCard({
  payments,
  loading = false,
}: Props) {
  return (
    <Card>

      <div className="mb-5 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold">
            Recent Payments
          </h2>

          <p className="text-sm text-gray-500">
            Latest payments received
          </p>

        </div>

      </div>

      {loading ? (

        <div className="flex h-64 items-center justify-center">

          Loading...

        </div>

      ) : payments.length === 0 ? (

        <div className="flex h-64 items-center justify-center text-gray-400">

          No payments found.

        </div>

      ) : (

        <div className="space-y-3">

          {payments.map((payment) => (

            <div
              key={payment.id}
              className="flex items-center justify-between rounded-xl border p-4 hover:bg-gray-50 transition"
            >

              <div>

                <p className="font-semibold">

                  {payment.tenant_name ?? "Unknown Tenant"}

                </p>

                <p className="text-xs text-gray-500">

                  {payment.reference_number ?? "-"}

                </p>

                <p className="text-xs text-gray-400">

                  {formatDate(payment.payment_date)}

                </p>

              </div>

              <div className="text-right">

                <p className="font-bold text-green-600">

                  {formatCurrency(payment.amount)}

                </p>

                <p className="text-xs text-gray-500">

                  {payment.payment_method ?? "-"}

                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </Card>
  );
}
