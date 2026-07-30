"use client";

import Card from "@/components/ui/Card";

import {
  DollarSign,
  Wallet,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock3,
} from "lucide-react";

type Props = {
  amount: number;
  amountPaid: number;
  balance: number;
  dueDate: string;
  status: string;
};

function getDaysDifference(date: string) {
  if (!date) return null;

  const today = new Date();
  const due = new Date(date);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  return Math.floor(
    (due.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}

function formatDueStatus(
  status: string,
  balance: number,
  dueDate: string
) {
  if (status === "Paid")
    return {
      text: "Paid in Full",
      color: "text-green-600",
      icon: CheckCircle2,
    };

  const days = getDaysDifference(dueDate);

  if (days === null)
    return {
      text: "No Due Date",
      color: "text-gray-500",
      icon: Clock3,
    };

  if (days < 0 && balance > 0)
    return {
      text: `${Math.abs(days)} Days Overdue`,
      color: "text-red-600",
      icon: AlertTriangle,
    };

  if (days === 0)
    return {
      text: "Due Today",
      color: "text-amber-600",
      icon: Clock3,
    };

  return {
    text: `Due in ${days} Days`,
    color: "text-sky-600",
    icon: CalendarClock,
  };
}

function statusClasses(status: string) {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-700";

    case "Issued":
      return "bg-blue-100 text-blue-700";

    case "Partially Paid":
      return "bg-amber-100 text-amber-700";

    case "Overdue":
      return "bg-red-100 text-red-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    case "Draft":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function InvoiceKpiCards({
  amount,
  amountPaid,
  balance,
  dueDate,
  status,
}: Props) {
  const due = formatDueStatus(
    status,
    balance,
    dueDate
  );

  const DueIcon = due.icon;

  const collectionRate =
    amount > 0
      ? Math.round(
          (amountPaid / amount) * 100
        )
      : 0;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      <Card>

        <div className="flex items-start justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Invoice Total
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              KSh {amount.toLocaleString()}
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Total amount billed
            </p>

          </div>

          <div className="rounded-xl bg-amber-50 p-3">

            <DollarSign className="h-7 w-7 text-amber-600" />

          </div>

        </div>

      </Card>

      <Card>

        <div className="flex items-start justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Amount Paid
            </p>

            <h2 className="mt-2 text-3xl font-bold text-green-600">
              KSh {amountPaid.toLocaleString()}
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              {collectionRate}% collected
            </p>

          </div>

          <div className="rounded-xl bg-green-50 p-3">

            <Wallet className="h-7 w-7 text-green-600" />

          </div>

        </div>

      </Card>

      <Card>

        <div className="flex items-start justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Outstanding
            </p>

            <h2
              className={`mt-2 text-3xl font-bold ${
                balance === 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              KSh {balance.toLocaleString()}
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Remaining balance
            </p>

          </div>

          <div
            className={`rounded-xl p-3 ${
              balance === 0
                ? "bg-green-50"
                : "bg-red-50"
            }`}
          >

            <AlertTriangle
              className={`h-7 w-7 ${
                balance === 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            />

          </div>

        </div>

      </Card>

      <Card>

        <div className="flex items-start justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Invoice Status
            </p>

            <div className="mt-3">

              <span
                className={`rounded-full px-4 py-2 text-sm font-semibold ${statusClasses(
                  status
                )}`}
              >
                {status}
              </span>

            </div>

          </div>

          <CheckCircle2 className="h-8 w-8 text-gray-400" />

        </div>

      </Card>

      <Card>

        <div className="flex items-start justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Due Date
            </p>

            <h3 className="mt-2 text-xl font-bold">
              {dueDate}
            </h3>

            <p className={`mt-3 text-sm ${due.color}`}>
              {due.text}
            </p>

          </div>

          <DueIcon
            className={`h-8 w-8 ${due.color}`}
          />

        </div>

      </Card>

      <Card>

        <div>

          <div className="flex items-center justify-between">

            <span className="text-sm text-gray-500">
              Collection Progress
            </span>

            <span className="font-semibold">
              {collectionRate}%
            </span>

          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">

            <div
              className="h-full rounded-full bg-green-600 transition-all duration-500"
              style={{
                width: `${collectionRate}%`,
              }}
            />

          </div>

          <div className="mt-4 flex justify-between text-sm text-gray-500">

            <span>
              Paid
            </span>

            <span>
              Balance
            </span>

          </div>

        </div>

      </Card>

    </div>
  );
}
