"use client";

import Link from "next/link";

import {
  User,
  Building2,
  Home,
  DollarSign,
  Calendar,
  CreditCard,
} from "lucide-react";

type Payment = {
  id: string;

  receipt_number: string;

  occupant_name: string;

  property_name: string;

  unit_number: string;

  amount_due: number;

  amount_paid: number;

  balance: number;

  due_date: string;

  payment_date?: string;

  payment_method?: string;

  status:
    | "Paid"
    | "Partial"
    | "Pending"
    | "Overdue";
};

type Props = {
  payment: Payment;
};

export default function PaymentCard({
  payment,
}: Props) {

  function getStatusColor(
    status: string
  ) {

    switch (status) {

      case "Paid":
        return "bg-green-100 text-green-700";

      case "Partial":
        return "bg-amber-100 text-amber-700";

      case "Pending":
        return "bg-blue-100 text-blue-700";

      case "Overdue":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";

    }

  }

  return (

    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-xl">

      {/* Header */}

      <div className="flex items-start justify-between p-6">

        <div>

          <h3 className="text-2xl font-bold text-gray-900">

            {payment.occupant_name}

          </h3>

          <p className="mt-1 text-sm text-gray-500">

            {payment.receipt_number}

          </p>

        </div>

        <span
          className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor(
            payment.status
          )}`}
        >

          {payment.status}

        </span>

      </div>

      {/* Details */}

      <div className="space-y-4 border-y border-gray-100 px-6 py-5">

        <div className="flex items-center gap-3">

          <Building2
            size={18}
            className="text-[#D4AF37]"
          />

          <span>

            {payment.property_name}

          </span>

        </div>

        <div className="flex items-center gap-3">

          <Home
            size={18}
            className="text-[#D4AF37]"
          />

          <span>

            Unit {payment.unit_number}

          </span>

        </div>

        <div className="flex items-center gap-3">

          <DollarSign
            size={18}
            className="text-[#D4AF37]"
          />

          <span>

            Expected:
            <strong className="ml-2">

              KSh {payment.amount_due.toLocaleString()}

            </strong>

          </span>

        </div>

        <div className="flex items-center gap-3">

          <CreditCard
            size={18}
            className="text-green-600"
          />

          <span>

            Paid:
            <strong className="ml-2 text-green-600">

              KSh {payment.amount_paid.toLocaleString()}

            </strong>

          </span>

        </div>

        <div className="flex items-center gap-3">

          <DollarSign
            size={18}
            className="text-red-500"
          />

          <span>

            Balance:
            <strong className="ml-2 text-red-600">

              KSh {payment.balance.toLocaleString()}

            </strong>

          </span>

        </div>

        <div className="flex items-center gap-3">

          <Calendar
            size={18}
            className="text-[#D4AF37]"
          />

          <span>

            Due:
            <strong className="ml-2">

              {payment.due_date}

            </strong>

          </span>

        </div>

      </div>

      {/* Footer */}

      <div className="grid grid-cols-2 gap-3 p-6">

        <button
          className="rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
        >

          Record Payment

        </button>

        <Link
          href={`/payments/${payment.id}`}
          className="rounded-xl border border-gray-300 py-3 text-center font-semibold transition hover:bg-gray-100"
        >

          View Ledger

        </Link>

      </div>

    </div>

  );

}
