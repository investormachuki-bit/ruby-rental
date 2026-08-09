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

  /*
   * ------------------------------------------------------------
   * HEADER
   * ------------------------------------------------------------
   */

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

  /*
   * ------------------------------------------------------------
   * RECEIVED FROM
   * ------------------------------------------------------------
   */

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(0);

  pdf.text("RECEIVED FROM", 20, 52);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);

  const tenantName =
    safeText(tenant.full_name) ||
    `${safeText(tenant.first_name)} ${safeText(
      tenant.last_name
    )}`.trim() ||
    "Tenant";

  let partyY = 59;

  pdf.text(tenantName, 20, partyY);
  partyY += 5;

  if (safeText(tenant.phone)) {
    pdf.text(safeText(tenant.phone), 20, partyY);
    partyY += 5;
  }

  if (safeText(tenant.email)) {
    pdf.text(safeText(tenant.email), 20, partyY);
    partyY += 5;
  }

  if (safeText(property.name)) {
    pdf.text(safeText(property.name), 20, partyY);
    partyY += 5;
  }

  if (safeText(unit.unit_number)) {
    pdf.text(
      `Unit ${safeText(unit.unit_number)}`,
      20,
      partyY
    );
  }

  /*
   * ------------------------------------------------------------
   * PAYMENT DETAILS
   * ------------------------------------------------------------
   */

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

  rows.push([
    "Amount Received",
    money(data.amount, currency),
  ]);

  autoTable(pdf, {
    startY: 82,
    head: [["Description", "Details"]],
    body: rows,
    theme: "grid",
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: 255,
      fontStyle: "bold",
    },
  });

  /*
   * ------------------------------------------------------------
   * INVOICE / ALLOCATION SUMMARY
   * ------------------------------------------------------------
   */

  let currentY =
    ((pdf as any).lastAutoTable?.finalY ?? 82) + 8;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(0);

  pdf.text("PAYMENT SUMMARY", 20, currentY);

  currentY += 6;

  /*
   * Multiple invoice allocations
   */

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
      head: [
        [
          "Invoice",
          "Invoice Amount",
          "Applied",
          "Balance",
        ],
      ],
      body: allocationRows,
      theme: "grid",
      styles: {
        fontSize: 8.5,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: "bold",
      },
      columnStyles: {
        1: { halign: "right" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
    });

    currentY =
      ((pdf as any).lastAutoTable?.finalY ??
        currentY) + 7;
  } else {
    /*
     * Payment has not been allocated to an invoice.
     */

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);

    pdf.text(
      "This payment has not been allocated to an invoice.",
      20,
      currentY
    );

    currentY += 7;
  }

  /*
   * ------------------------------------------------------------
   * PAYMENT TOTALS
   * ------------------------------------------------------------
   */

  const amountReceived = Number(
    data.amount ?? payment.amount ?? 0
  );

  const allocatedAmount = Number(
    payment.allocated_amount ?? 0
  );

  const unallocatedAmount = Number(
    payment.unallocated_amount ?? 0
  );

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
    theme: "plain",
    styles: {
      fontSize: 9,
      cellPadding: 2.5,
    },
    columnStyles: {
      0: {
        fontStyle: "bold",
        cellWidth: 100,
      },
      1: {
        halign: "right",
        fontStyle: "bold",
      },
    },
  });

  currentY =
    ((pdf as any).lastAutoTable?.finalY ??
      currentY) + 5;

  /*
   * ------------------------------------------------------------
   * NOTES
   * ------------------------------------------------------------
   */

  const notes =
    safeText(data.notes) ||
    safeText(payment.notes);

  if (notes) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9.5);

    pdf.text("NOTES", 20, currentY);

    currentY += 5;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);

    const noteLines = pdf.splitTextToSize(
      notes,
      170
    );

    pdf.text(noteLines, 20, currentY);

    currentY +=
      noteLines.length * 4 + 5;
  }

  /*
   * ------------------------------------------------------------
   * FINAL RECEIPT TOTAL
   * ------------------------------------------------------------
   */

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.setTextColor(primaryColor);

  pdf.text(
    `TOTAL RECEIVED: ${money(
      amountReceived,
      currency
    )}`,
    20,
    currentY + 3
  );

  /*
   * ------------------------------------------------------------
   * FOOTER
   * ------------------------------------------------------------
   */

  if (!branding.removeRubyBranding) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(110);

    pdf.text(
      "Powered by Ruby Rental • +254 796 594 295",
      20,
      285
    );
  }

  return pdf;
}
