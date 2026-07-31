"use client";

import Card from "@/components/ui/Card";
import {
  Wallet,
  AlertTriangle,
  CreditCard,
  TrendingUp,
} from "lucide-react";

type Props = {
  revenueThisMonth: number;
  outstandingRent: number;
  collectionsToday: number;
  collectionRate: number;
};

function formatCurrency(value: number) {
  return `KES ${value.toLocaleString()}`;
}

export default function FinanceKPICards({
  revenueThisMonth,
  outstandingRent,
  collectionsToday,
  collectionRate,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Revenue This Month
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {formatCurrency(revenueThisMonth)}
            </h2>

            <p className="mt-2 text-sm text-green-600">
              Cash received this month
            </p>
          </div>

          <Wallet
            size={40}
            className="text-[#D4AF37]"
          />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Outstanding Rent
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {formatCurrency(outstandingRent)}
            </h2>

            <p className="mt-2 text-sm text-red-500">
              Awaiting collection
            </p>
          </div>

          <AlertTriangle
            size={40}
            className="text-red-500"
          />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Collections Today
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {formatCurrency(collectionsToday)}
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Payments received today
            </p>
          </div>

          <CreditCard
            size={40}
            className="text-[#D4AF37]"
          />
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Collection Rate
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {collectionRate.toFixed(1)}%
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Current billing cycle
            </p>
          </div>

          <TrendingUp
            size={40}
            className="text-green-600"
          />
        </div>
      </Card>

    </div>
  );
}
