"use client";

import EmptyState from "@/components/ui/EmptyState";
import Loading from "@/components/ui/Loading";
import InvoiceRow, { InvoiceRowData } from "./InvoiceRow";

export type InvoiceSortField = "invoice_date" | "due_date" | "amount" | "balance";
export type InvoiceSortDirection = "asc" | "desc";

type Props = {
  invoices: InvoiceRowData[];
  loading?: boolean;
  sortConfig?: { field: InvoiceSortField; direction: InvoiceSortDirection };
  onSortChange?: (field: InvoiceSortField) => void;
  page?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onView?: (invoiceId: string) => void;
  onRecordPayment?: (invoiceId: string) => void;
  onDownload?: (invoiceId: string) => void;
  onPrint?: (invoiceId: string) => void;
  onDuplicate?: (invoiceId: string) => void;
  onCancel?: (invoiceId: string) => void;
};

export default function InvoicesList({
  invoices,
  loading = false,
  sortConfig,
  onSortChange,
  page = 1,
  pageSize = 10,
  totalItems = 0,
  totalPages = 1,
  onPageChange,
  onView,
  onRecordPayment,
  onDownload,
  onPrint,
  onDuplicate,
  onCancel,
}: Props) {
  if (loading) {
    return <Loading title="Loading Invoices" description="Preparing your invoice ledger..." />;
  }

  if (!invoices.length) {
    return (
      <EmptyState
        title="No invoices found"
        description="Try adjusting your filters or create a new invoice from a lease."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Invoice No.</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Tenant</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Property</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Unit</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Billing Period</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                <button type="button" className="font-semibold uppercase" onClick={() => onSortChange?.("due_date")}>
                  Due Date
                </button>
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
                <button type="button" className="font-semibold uppercase" onClick={() => onSortChange?.("amount")}>
                  Total
                </button>
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">Paid</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
                <button type="button" className="font-semibold uppercase" onClick={() => onSortChange?.("balance")}>
                  Balance
                </button>
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">Status</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {invoices.map((invoice) => (
              <InvoiceRow
                key={invoice.id}
                invoice={invoice}
                onView={onView}
                onRecordPayment={onRecordPayment}
                onDownload={onDownload}
                onPrint={onPrint}
                onDuplicate={onDuplicate}
                onCancel={onCancel}
              />
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalItems)} of {totalItems} invoices
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange?.(page - 1)}
              disabled={page <= 1}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => onPageChange?.(page + 1)}
              disabled={page >= totalPages}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
