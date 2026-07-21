"use client";

import { useRouter } from "next/navigation";
import {
  Eye,
  Wallet,
  Download,
  Printer,
  Copy,
  XCircle,
} from "lucide-react";

type Props = {
  invoiceId: string;
  status?: string;
  onView?: (invoiceId: string) => void;
  onRecordPayment?: (invoiceId: string) => void;
  onDownload?: (invoiceId: string) => void;
  onPrint?: (invoiceId: string) => void;
  onDuplicate?: (invoiceId: string) => void;
  onCancel?: (invoiceId: string) => void;
};

export default function InvoiceActions({
  invoiceId,
  status,
  onView,
  onRecordPayment,
  onDownload,
  onPrint,
  onDuplicate,
  onCancel,
}: Props) {
  const router = useRouter();
  const isLocked = status === "Paid" || status === "Cancelled";

  const handleView = () => {
    if (onView) {
      onView(invoiceId);
      return;
    }
    router.push(`/invoices/${invoiceId}`);
  };

  const handleRecordPayment = () => {
    if (onRecordPayment) {
      onRecordPayment(invoiceId);
      return;
    }
    router.push(`/invoices/${invoiceId}?action=payment`);
  };

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button
        onClick={handleView}
        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
        title="View Invoice"
        type="button"
      >
        <Eye className="h-4 w-4" />
      </button>

      <button
        onClick={handleRecordPayment}
        disabled={isLocked}
        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        title="Record Payment"
        type="button"
      >
        <Wallet className="h-4 w-4" />
      </button>

      <button
        onClick={() => (onPrint ? onPrint(invoiceId) : window.print())}
        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
        title="Print"
        type="button"
      >
        <Printer className="h-4 w-4" />
      </button>

      <button
        onClick={() => (onDownload ? onDownload(invoiceId) : window.alert("PDF download is not available yet."))}
        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100"
        title="Download PDF"
        type="button"
      >
        <Download className="h-4 w-4" />
      </button>

      <button
        onClick={() => onDuplicate?.(invoiceId)}
        disabled={isLocked}
        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        title="Duplicate Invoice"
        type="button"
      >
        <Copy className="h-4 w-4" />
      </button>

      <button
        onClick={() => onCancel?.(invoiceId)}
        disabled={isLocked}
        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
        title="Cancel Invoice"
        type="button"
      >
        <XCircle className="h-4 w-4" />
      </button>
    </div>
  );
}
