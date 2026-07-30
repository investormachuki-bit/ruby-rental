"use client";

import Card from "@/components/ui/Card";

import {
  CheckCircle2,
  Clock3,
  Mail,
  MessageCircle,
  Wallet,
  FileText,
  Ban,
  AlertTriangle,
} from "lucide-react";

type TimelineEvent = {
  id: string;

  event: string;

  description?: string;

  created_at: string;

  created_by?: string;
};

type Props = {
  timeline: TimelineEvent[];
};

function getEventIcon(event: string) {

  switch (event) {

    case "Invoice Created":
      return FileText;

    case "Invoice Issued":
      return CheckCircle2;

    case "Invoice Emailed":
      return Mail;

    case "WhatsApp Sent":
      return MessageCircle;

    case "Payment Recorded":
      return Wallet;

    case "Reminder Sent":
      return AlertTriangle;

    case "Invoice Cancelled":
      return Ban;

    default:
      return Clock3;

  }

}

function getEventColor(event: string) {

  switch (event) {

    case "Invoice Created":
      return "bg-blue-100 text-blue-700";

    case "Invoice Issued":
      return "bg-green-100 text-green-700";

    case "Invoice Emailed":
      return "bg-indigo-100 text-indigo-700";

    case "WhatsApp Sent":
      return "bg-emerald-100 text-emerald-700";

    case "Payment Recorded":
      return "bg-green-100 text-green-700";

    case "Reminder Sent":
      return "bg-amber-100 text-amber-700";

    case "Invoice Cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";

  }

}

export default function InvoiceTimeline({
  timeline,
}: Props) {

  return (

    <Card>

      <div className="mb-8">

        <h2 className="text-xl font-bold">

          Invoice Timeline

        </h2>

        <p className="text-sm text-gray-500">

          Complete activity history for this invoice.

        </p>

      </div>

      {timeline.length === 0 ? (

        <div className="rounded-xl border border-dashed p-12 text-center text-gray-500">

          No activity has been recorded.

        </div>

      ) : (

        <div className="space-y-6">

          {timeline.map((entry, index) => {

            const Icon =
              getEventIcon(
                entry.event
              );

            const color =
              getEventColor(
                entry.event
              );

            return (

              <div
                key={entry.id}
                className="relative flex gap-5"
              >

                {index !==
                  timeline.length - 1 && (

                  <div className="absolute left-5 top-12 h-full w-px bg-gray-200" />

                )}

                <div
                  className={`relative z-10 rounded-full p-3 ${color}`}
                >

                  <Icon className="h-5 w-5" />

                </div>

                <div className="flex-1 rounded-xl border bg-gray-50 p-5">

                  <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                      <h3 className="font-semibold">

                        {entry.event}

                      </h3>

                      {entry.description && (

                        <p className="mt-1 text-sm text-gray-500">

                          {entry.description}

                        </p>

                      )}

                    </div>

                    <div className="text-right text-sm text-gray-500">

                      <div>

                        {new Date(
                          entry.created_at
                        ).toLocaleString()}

                      </div>

                      {entry.created_by && (

                        <div>

                          {entry.created_by}

                        </div>

                      )}

                    </div>

                  </div>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </Card>

  );

}
