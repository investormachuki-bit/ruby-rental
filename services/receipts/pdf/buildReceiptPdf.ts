import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { getBranding } from "@/services/branding/getBranding";

function safeText(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function money(value: unknown, currency = "KES") {
  return `${currency} ${Number(value ?? 0).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export async function buildReceiptPdf(data: any) {
  const branding: any = await getBranding();

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const primaryColor = branding.primaryColor || "#111827";
  const currency =
    branding.currencySymbol ||
    branding.currency ||
    "KES";

  const payment = data.payment ?? {};
  const tenant = data.tenant ?? {};
  const property = data.property ?? {};
  const unit = data.unit ?? {};

  const allocations = Array.isArray(payment.allocations)
    ? payment.allocations
    : [];

  const amountReceived = Number(
    data.amount ?? payment.amount ?? 0
  );

  const allocatedAmount = Number(
    payment.allocated_amount ?? 0
  );

  const unallocatedAmount = Number(
    payment.unallocated_amount ?? 0
  );

  // =========================
  // HEADER
  // =========================

  pdf.setTextColor(primaryColor);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);

  pdf.text(
    safeText(
      branding.tradingName ||
        branding.companyName ||
        "Ruby Rental"
    ),
    20,
    18
  );

  const headerLines = [
    branding.physicalAddress || branding.address,
    branding.phone,
    branding.email,
    branding.website,
  ]
    .map(safeText)
    .filter(Boolean);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(90);

  let headerY = 25;

  for (const line of headerLines) {
    pdf.text(line, 20, headerY);
    headerY += 4.5;
  }

  pdf.setTextColor(0);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);

  pdf.text("RECEIPT", 150, 18);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  pdf.text(
    `Receipt No: ${safeText(data.receipt_number)}`,
    150,
    26
  );

  pdf.text(
    `Date: ${safeText(data.receipt_date)}`,
    150,
    32
  );

  // =========================
  // RECEIVED FROM
  // =========================

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(0);

  pdf.text("RECEIVED FROM", 20, 49);

  const tenantName =
    safeText(tenant.full_name) ||
    `${safeText(tenant.first_name)} ${safeText(
      tenant.last_name
    )}`.trim() ||
    "Tenant";

  const partyLines = [
    tenantName,
    tenant.phone,
    tenant.email,
    property.name,
    safeText(unit.unit_number)
      ? `Unit ${safeText(unit.unit_number)}`
      : "",
  ]
    .map(safeText)
    .filter(Boolean);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  let partyY = 56;

  for (const line of partyLines) {
    pdf.text(line, 20, partyY);
    partyY += 4.5;
  }

  // =========================
  // PAYMENT DETAILS
  // =========================

  const rows: string[][] = [];

  if (safeText(payment.payment_type)) {
    rows.push([
      "Payment Type",
      safeText(payment.payment_type),
    ]);
  }

  if (safeText(payment.payment_method)) {
    rows.push([
      "Payment Method",
      safeText(payment.payment_method),
    ]);
  }

  if (safeText(payment.reference_number)) {
    rows.push([
      "Reference",
      safeText(payment.reference_number),
    ]);
  }

  autoTable(pdf, {
    startY: Math.max(78, partyY + 4),
    head: [["Description", "Details"]],
    body: rows,
    theme: "grid",
    styles: {
      fontSize: 8.5,
      cellPadding: 2.6,
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontStyle: "bold",
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 110 },
    },
  });

  let currentY =
    ((pdf as any).lastAutoTable?.finalY ?? 78) + 7;

  // =========================
  // PAYMENT SUMMARY
  // =========================

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10.5);
  pdf.setTextColor(0);

  pdf.text("PAYMENT SUMMARY", 20, currentY);

  currentY += 5;

  if (allocations.length > 0) {
    const allocationRows = allocations.map(
      (allocation: any) => [
        safeText(
          allocation.invoice_number
        ) || "Invoice",

        money(
          allocation.invoice_amount,
          currency
        ),

        money(
          allocation.allocated_amount,
          currency
        ),

        money(
          allocation.invoice_balance,
          currency
        ),
      ]
    );

    autoTable(pdf, {
      startY: currentY,

      head: [[
        "Invoice",
        "Invoice Amount",
        "Applied",
        "Balance",
      ]],

      body: allocationRows,

      theme: "grid",

      styles: {
        fontSize: 8,
        cellPadding: 2.5,
      },

      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: "bold",
      },

      columnStyles: {
        0: {
          cellWidth: 48,
        },
        1: {
          cellWidth: 44,
          halign: "right",
        },
        2: {
          cellWidth: 44,
          halign: "right",
        },
        3: {
          cellWidth: 44,
          halign: "right",
        },
      },
    });

    currentY =
      ((pdf as any).lastAutoTable?.finalY ??
        currentY) + 5;
  } else {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(80);

    pdf.text(
      "No invoice allocation was made for this payment.",
      20,
      currentY
    );

    currentY += 7;
  }

  // =========================
  // FINANCIAL SUMMARY
  // =========================

  const summaryRows: string[][] = [
    [
      "Amount Received",
      money(amountReceived, currency),
    ],
    [
      "Amount Applied",
      money(allocatedAmount, currency),
    ],
  ];

  if (unallocatedAmount > 0) {
    summaryRows.push([
      "Tenant Credit / Overpayment",
      money(unallocatedAmount, currency),
    ]);
  }

  autoTable(pdf, {
    startY: currentY,

    body: summaryRows,

    theme: "grid",

    styles: {
      fontSize: 8.5,
      cellPadding: 2.8,
    },

    columnStyles: {
      0: {
        cellWidth: 115,
        fontStyle: "bold",
      },

      1: {
        cellWidth: 65,
        halign: "right",
        fontStyle: "bold",
      },
    },
  });

  currentY =
    ((pdf as any).lastAutoTable?.finalY ??
      currentY) + 6;

  // =========================
  // NOTES
  // =========================

  const notes =
    safeText(data.notes) ||
    safeText(payment.notes);

  if (notes) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(0);

    pdf.text("NOTES", 20, currentY);

    currentY += 4.5;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.2);

    const noteLines =
      pdf.splitTextToSize(notes, 170);

    pdf.text(
      noteLines,
      20,
      currentY
    );

    currentY +=
      noteLines.length * 3.8 + 5;
  }

  // =========================
  // FINAL TOTAL
  // =========================

  const hasCredit = unallocatedAmount > 0;

  const bannerHeight = hasCredit ? 20 : 14;

  const bannerY = Math.min(
    Math.max(currentY, 185),
    235
  );

  pdf.setFillColor(primaryColor);

  pdf.roundedRect(
    20,
    bannerY,
    170,
    bannerHeight,
    2,
    2,
    "F"
  );

  pdf.setTextColor(255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);

  pdf.text(
    `TOTAL RECEIVED: ${money(
      amountReceived,
      currency
    )}`,
    25,
    bannerY + 8
  );

  if (hasCredit) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);

    pdf.text(
      `Tenant credit available: ${money(
        unallocatedAmount,
        currency
      )}`,
      25,
      bannerY + 14
    );
  }

  // =========================
  // FOOTER
  // =========================

  if (!branding.removeRubyBranding) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(110);

    pdf.text(
      "Powered by Ruby Rental • +254 796 594 295",
      20,
      278
    );
  }

  return pdf;
}
