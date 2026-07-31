"use client";

import Card from "@/components/ui/Card";
import { BarChart3, TrendingUp } from "lucide-react";

type RevenuePoint = {
  month: string;
  revenue: number;
};

type Props = {
  data?: RevenuePoint[];
  loading?: boolean;
};

function formatCurrency(value: number) {
  return `KES ${value.toLocaleString()}`;
}

export default function RevenueChartCard({
  data = [],
  loading = false,
}: Props) {
  const highestRevenue =
    data.length > 0
      ? Math.max(...data.map((d) => d.revenue))
      : 1;

  return (
    <Card>

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold">
            Revenue Trend
          </h2>

          <p className="text-sm text-gray-500">
            Monthly rent collections
          </p>

        </div>

        <TrendingUp
          size={26}
          className="text-[#D4AF37]"
        />

      </div>

      {loading ? (

        <div className="flex h-72 items-center justify-center">

          Loading...

        </div>

      ) : data.length === 0 ? (

        <div className="flex h-72 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300">

          <BarChart3
            size={48}
            className="mb-3 text-gray-400"
          />

          <p className="text-gray-500">
            Revenue chart will appear here.
          </p>

        </div>

      ) : (

        <div>

          <div className="flex h-72 items-end gap-4">

            {data.map((item) => (

              <div
                key={item.month}
                className="flex flex-1 flex-col items-center"
              >

                <div
                  className="w-full rounded-t-xl bg-[#D4AF37] transition-all hover:opacity-80"
                  style={{
                    height: `${
                      (item.revenue /
                        highestRevenue) *
                      220
                    }px`,
                  }}
                />

                <p className="mt-3 text-xs font-medium">

                  {item.month}

                </p>

              </div>

            ))}

          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4">

            <div>

              <p className="text-sm text-gray-500">

                Highest Month

              </p>

              <p className="font-semibold">

                {formatCurrency(highestRevenue)}

              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">

                Months Displayed

              </p>

              <p className="font-semibold">

                {data.length}

              </p>

            </div>

          </div>

        </div>

      )}

    </Card>
  );
}
