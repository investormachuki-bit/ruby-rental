"use client";

type Props = {
  search: string;
  status: string;
  property: string;
  tenant: string;
  billingPeriod: string;
  properties: string[];
  tenants: string[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPropertyChange: (value: string) => void;
  onTenantChange: (value: string) => void;
  onBillingPeriodChange: (value: string) => void;
  onReset: () => void;
};

export default function InvoiceFilters({
  search,
  status,
  property,
  tenant,
  billingPeriod,
  properties,
  tenants,
  onSearchChange,
  onStatusChange,
  onPropertyChange,
  onTenantChange,
  onBillingPeriodChange,
  onReset,
}: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        <input
          type="text"
          placeholder="Search invoice, tenant, property..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#D4AF37]"
        />

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#D4AF37]"
        >
          <option value="All">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Partially Paid">Partially Paid</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Sent">Sent</option>
        </select>

        <select
          value={property}
          onChange={(e) => onPropertyChange(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#D4AF37]"
        >
          <option value="All">All Properties</option>
          {properties.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={tenant}
          onChange={(e) => onTenantChange(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#D4AF37]"
        >
          <option value="All">All Tenants</option>
          {tenants.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <input
          type="month"
          value={billingPeriod}
          onChange={(e) => onBillingPeriodChange(e.target.value)}
          className="rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#D4AF37]"
        />

        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-red-200 px-4 py-3 font-medium text-red-600 transition hover:bg-red-50"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
