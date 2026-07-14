"use client";

import { useMemo, useState } from "react";

import PaymentCard from "./PaymentCard";

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
  payments: Payment[];
};

export default function PaymentsList({
  payments,
}: Props) {

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const filteredPayments =
    useMemo(() => {

      let results = [...payments];

      if (search) {

        const keyword =
          search.toLowerCase();

        results = results.filter(
          (payment) =>
            payment.occupant_name
              .toLowerCase()
              .includes(keyword) ||

            payment.property_name
              .toLowerCase()
              .includes(keyword) ||

            payment.unit_number
              .toLowerCase()
              .includes(keyword) ||

            payment.receipt_number
              .toLowerCase()
              .includes(keyword)
        );

      }

      if (status !== "All") {

        results = results.filter(
          (payment) =>
            payment.status === status
        );

      }

      return results;

    }, [
      payments,
      search,
      status,
    ]);

  return (

    <div className="space-y-8">

      {/* Filters */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <input
          type="text"
          placeholder="Search payment..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none transition focus:border-black"
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
          className="rounded-xl border border-gray-200 bg-white px-4 py-3"
        >

          <option value="All">
            All Statuses
          </option>

          <option value="Paid">
            Paid
          </option>

          <option value="Partial">
            Partial
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="Overdue">
            Overdue
          </option>

        </select>

      </div>

      {/* Cards */}

      {filteredPayments.length === 0 ? (

        <div className="rounded-2xl border border-dashed bg-white p-12 text-center">

          <h2 className="text-2xl font-semibold">

            No Payments Found

          </h2>

          <p className="mt-3 text-gray-500">

            Try changing your search or filters.

          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          {filteredPayments.map(
            (payment) => (

              <PaymentCard
                key={payment.id}
                payment={payment}
              />

            )
          )}

        </div>

      )}

    </div>

  );
}
