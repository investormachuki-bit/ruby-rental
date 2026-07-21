"use client";

type Props = {
  search: string;
  status: string;
  property: string;
  billingPeriod: string;

  properties: string[];

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPropertyChange: (value: string) => void;
  onBillingPeriodChange: (value: string) => void;

  onReset: () => void;
};

export default function InvoiceFilters({
  search,
  status,
  property,
  billingPeriod,
  properties,
  onSearchChange,
  onStatusChange,
  onPropertyChange,
  onBillingPeriodChange,
  onReset,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5">

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">

        {/* Search */}

        <input
          type="text"
          placeholder="Search invoice, tenant..."
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          className="rounded-xl border px-4 py-3"
        />

        {/* Status */}

        <select
          value={status}
          onChange={(e) =>
            onStatusChange(e.target.value)
          }
          className="rounded-xl border px-4 py-3"
        >
          <option value="All">
            All Statuses
          </option>

          <option value="Draft">
            Draft
          </option>

          <option value="Unpaid">
            Unpaid
          </option>

          <option value="Partially Paid">
            Partially Paid
          </option>

          <option value="Paid">
            Paid
          </option>

          <option value="Overdue">
            Overdue
          </option>

          <option value="Cancelled">
            Cancelled
          </option>

        </select>

        {/* Property */}

        <select
          value={property}
          onChange={(e) =>
            onPropertyChange(
              e.target.value
            )
          }
          className="rounded-xl border px-4 py-3"
        >

          <option value="All">
            All Properties
          </option>

          {properties.map((item) => (

            <option
              key={item}
              value={item}
            >
              {item}
            </option>

          ))}

        </select>

        {/* Billing Period */}

        <input
          type="month"
          value={billingPeriod}
          onChange={(e) =>
            onBillingPeriodChange(
              e.target.value
            )
          }
          className="rounded-xl border px-4 py-3"
        />

        {/* Reset */}

        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-red-200 px-4 py-3 font-medium text-red-600 hover:bg-red-50"
        >
          Reset Filters
        </button>

      </div>

    </div>
  );
}
