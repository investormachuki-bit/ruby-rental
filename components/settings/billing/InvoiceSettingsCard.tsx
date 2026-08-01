type Props = {
  form: {
    invoicePrefix: string;
    nextInvoiceNumber: number;
    dueDays: number;
    gracePeriod: number;
  };
  update: (key: string, value: string | number) => void;
};

export default function InvoiceSettingsCard({
  form,
  update,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Invoice Settings
      </h2>

      <div className="space-y-4">

        <input
          className="w-full rounded-xl border p-3"
          placeholder="Invoice Prefix"
          value={form.invoicePrefix}
          onChange={(e) =>
            update("invoicePrefix", e.target.value)
          }
        />

        <input
          type="number"
          className="w-full rounded-xl border p-3"
          placeholder="Next Invoice Number"
          value={form.nextInvoiceNumber}
          onChange={(e) =>
            update(
              "nextInvoiceNumber",
              Number(e.target.value)
            )
          }
        />

        <input
          type="number"
          className="w-full rounded-xl border p-3"
          placeholder="Due Days"
          value={form.dueDays}
          onChange={(e) =>
            update("dueDays", Number(e.target.value))
          }
        />

        <input
          type="number"
          className="w-full rounded-xl border p-3"
          placeholder="Grace Period"
          value={form.gracePeriod}
          onChange={(e) =>
            update(
              "gracePeriod",
              Number(e.target.value)
            )
          }
        />

      </div>

    </div>
  );
}
