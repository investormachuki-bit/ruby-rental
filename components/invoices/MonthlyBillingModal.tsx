"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { MonthlyBillingSummary } from "@/services/billing/types";

type Props = {
  open: boolean;
  onClose: () => void;
  billingMonth: string;
  onBillingMonthChange: (value: string) => void;
  onPreview: () => Promise<void>;
  onGenerate: () => Promise<void>;
  loading: boolean;
  progress: string[];
  summary: MonthlyBillingSummary | null;
};

export default function MonthlyBillingModal({
  open,
  onClose,
  billingMonth,
  onBillingMonthChange,
  onPreview,
  onGenerate,
  loading,
  progress,
  summary,
}: Props) {
  const [localPreviewed, setLocalPreviewed] = useState(false);

  useEffect(() => {
    if (!open) {
      setLocalPreviewed(false);
    }
  }, [open]);

  const summaryCards = useMemo(() => {
    if (!summary) return [];
    return [
      { label: "Generated", value: summary.generated },
      { label: "Skipped", value: summary.skipped_units },
      { label: "Failed", value: summary.failed_units },
      { label: "Expected Revenue", value: `KSh ${summary.expected_revenue.toLocaleString()}` },
      { label: "Rent Total", value: `KSh ${summary.rent_total.toLocaleString()}` },
      { label: "Utility Charges", value: `KSh ${summary.utility_charges.toLocaleString()}` },
      { label: "Previous Balances", value: `KSh ${summary.previous_balances.toLocaleString()}` },
    ];
  }, [summary]);

  return (
    <Modal
      open={open}
      title="Generate Monthly Invoices"
      description="Preview the billing run for a selected month, then confirm generation."
      onClose={onClose}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Close
          </Button>
          <Button variant="secondary" onClick={onPreview} loading={loading} disabled={loading}>
            Preview Summary
          </Button>
          <Button variant="primary" onClick={onGenerate} loading={loading} disabled={loading || !summary}>
            Confirm Generation
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <label className="mb-2 block text-sm font-semibold text-gray-700">Billing Month</label>
          <input
            type="month"
            value={billingMonth}
            onChange={(e) => onBillingMonthChange(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
          />
        </div>

        {(summary || progress.length > 0 || loading) && (
          <div className="rounded-2xl border border-gray-200 bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Billing Summary</h3>
              <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1 text-sm font-medium text-[#9A7B00]">
                {summary ? "Ready" : loading ? "Generating" : "Preview"}
              </span>
            </div>

            {summaryCards.length > 0 && (
              <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => (
                  <div key={card.label} className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
                    <p className="text-sm text-gray-500">{card.label}</p>
                    <p className="mt-2 text-lg font-semibold text-gray-900">{card.value}</p>
                  </div>
                ))}
              </div>
            )}

            {summary?.results?.length ? (
              <div className="space-y-3">
                {summary.results.map((item, index) => (
                  <div key={`${item.lease_id}-${index}`} className="rounded-2xl border border-gray-200 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.unit_label} · {item.tenant_name}
                        </p>
                        <p className="text-sm text-gray-500">{item.reason ?? "Invoice will be generated."}</p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-sm font-medium ${item.status === "generated" ? "bg-green-100 text-green-700" : item.status === "skipped" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {progress.length > 0 && (
              <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-700">Progress</p>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  {progress.map((item, index) => (
                    <li key={`${item}-${index}`} className="flex items-start gap-2">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#D4AF37]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
