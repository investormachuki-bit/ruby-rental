"use client";

import Link from "next/link";
import {
  Eye,
  Wallet,
  Download,
  Printer,
  MessageCircle,
  Share2,
  MoreHorizontal,
} from "lucide-react";

type Props = {
  invoiceId: string;
  onDownload?: (invoiceId: string) => void;
  onPrint?: (invoiceId: string) => void;
  onWhatsApp?: (invoiceId: string) => void;
  onShare?: (invoiceId: string) => void;
};

export default function InvoiceActions({
  invoiceId,
  onDownload,
  onPrint,
  onWhatsApp,
  onShare,
}: Props) {
  return (
    <div className="flex items-center justify-end gap-2">

      <Link
        href={`/invoices/${invoiceId}`}
        className="rounded-lg p-2 hover:bg-gray-100"
        title="View Invoice"
      >
        <Eye className="h-4 w-4" />
      </Link>

      <Link
        href={`/payments/new?invoice=${invoiceId}`}
        className="rounded-lg p-2 hover:bg-gray-100"
        title="Record Payment"
      >
        <Wallet className="h-4 w-4" />
      </Link>

      <button
        onClick={() => onDownload?.(invoiceId)}
        className="rounded-lg p-2 hover:bg-gray-100"
        title="Download PDF"
        type="button"
      >
        <Download className="h-4 w-4" />
      </button>

      <button
        onClick={() => onPrint?.(invoiceId)}
        className="rounded-lg p-2 hover:bg-gray-100"
        title="Print"
        type="button"
      >
        <Printer className="h-4 w-4" />
      </button>

      <button
        onClick={() => onWhatsApp?.(invoiceId)}
        className="rounded-lg p-2 hover:bg-gray-100"
        title="WhatsApp"
        type="button"
      >
        <MessageCircle className="h-4 w-4 text-green-600" />
      </button>

      <button
        onClick={() => onShare?.(invoiceId)}
        className="rounded-lg p-2 hover:bg-gray-100"
        title="Share"
        type="button"
      >
        <Share2 className="h-4 w-4" />
      </button>

      <button
        className="rounded-lg p-2 hover:bg-gray-100"
        title="More Actions"
        type="button"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

    </div>
  );
}
