"use client";

import { useState } from "react";

import MonthlyBillingModal from "@/components/invoices/MonthlyBillingModal";
import Button from "@/components/ui/Button";

import { runMonthlyBilling } from "@/services/billing/runMonthlyBilling";
import type { MonthlyBillingSummary } from "@/services/billing/types";

type Props = {
  onCompleted?: () => Promise<void> | void;
};

export default function BillingManager({
  onCompleted,
}: Props) {

  const [open, setOpen] = useState(false);

  const [billingMonth, setBillingMonth] =
    useState(new Date().toISOString().slice(0, 7));

  const [loading, setLoading] =
    useState(false);

  const [progress, setProgress] =
    useState<string[]>([]);

  const [summary, setSummary] =
    useState<MonthlyBillingSummary | null>(null);

  async function handlePreview() {

    setLoading(true);

    setProgress([
      "Preparing billing preview...",
    ]);

    try {

      const result =
        await runMonthlyBilling();

      setSummary(result);

      setProgress([
        `Previewed ${result.generated} invoices for ${result.billing_period}.`,
      ]);

    } catch (error: any) {

      setProgress([
        error?.message ??
          "Unable to preview billing.",
      ]);

    } finally {

      setLoading(false);

    }

  }

  async function handleGenerate() {

    setLoading(true);

    setProgress([
      "Starting monthly billing...",
    ]);

    try {

      const result =
        await runMonthlyBilling();

      setSummary(result);

      setProgress([
        `Generated ${result.generated} invoices.`,
        `Skipped ${result.skipped_units} units.`,
        `Failed ${result.failed_units} units.`,
      ]);

      await onCompleted?.();

    } catch (error: any) {

      setProgress([
        error?.message ??
          "Monthly billing failed.",
      ]);

    } finally {

      setLoading(false);

    }

  }

  return (
    <>

      <div className="mb-6 flex justify-end">

        <Button
          onClick={() => setOpen(true)}
        >
          Generate Monthly Billing
        </Button>

      </div>

      <MonthlyBillingModal

        open={open}

        onClose={() => setOpen(false)}

        billingMonth={billingMonth}

        onBillingMonthChange={
          setBillingMonth
        }

        onPreview={handlePreview}

        onGenerate={handleGenerate}

        loading={loading}

        progress={progress}

        summary={summary}

      />

    </>
  );

}
