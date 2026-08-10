"use client";

import Button from "@/components/ui/Button";

import {
  Download,
  Printer,
  Wallet,
  Mail,
  MessageCircle,
  Copy,
  Ban,
  ArrowLeft,
  Share2,
} from "lucide-react";

type Props = {
  loading?: boolean;
  onBack: () => void;
  onDownload: () => void;
  onShare: () => void;
  onPrint: () => void;
  onPayment: () => void;
  onEmail: () => void;
  onWhatsApp: () => void;
  onDuplicate: () => void;
  onCancel: () => void;
};

export default function InvoiceActionBar({
  loading = false,
  onBack,
  onDownload,
  onShare,
  onPrint,
  onPayment,
  onEmail,
  onWhatsApp,
  onDuplicate,
  onCancel,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <Button variant="secondary" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="secondary"
          onClick={onDownload}
          disabled={loading}
        >
          <Download className="mr-2 h-4 w-4" />
          PDF
        </Button>

        <Button
          variant="secondary"
          onClick={onShare}
          disabled={loading}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>

        <Button
          variant="secondary"
          onClick={onPrint}
          disabled={loading}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>

        <Button
          variant="secondary"
          onClick={onEmail}
          disabled={loading}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email
        </Button>

        <Button
          variant="secondary"
          onClick={onWhatsApp}
          disabled={loading}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          WhatsApp
        </Button>

        <Button
          variant="secondary"
          onClick={onDuplicate}
          disabled={loading}
        >
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </Button>

        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          <Ban className="mr-2 h-4 w-4" />
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={onPayment}
          loading={loading}
        >
          <Wallet className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>
    </div>
  );
}
