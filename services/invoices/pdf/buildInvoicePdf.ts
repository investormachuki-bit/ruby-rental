import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { getBranding } from "@/services/branding/getBranding";

function safeText(value: unknown, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function hasValue(value: unknown) {
  return (
    value !== null &&
    value !== undefined &&
    String(value).trim() !== ""
  );
}

function money(
  value: unknown,
  currencySymbol: string
) {
  return `${currencySymbol} ${Number(value ?? 0).toLocaleString(
    "en-KE",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

function formatDate(value: unknown) {
  if (!hasValue(value)) return "";

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-GB");
}

function statusColor(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "paid") {
    return [22, 101, 52] as [number, number, number];
  }

  if (
    normalized === "overdue" ||
    normalized === "cancelled"
  ) {
    return [185, 28, 28] as [number, number, number];
  }

  if (
    normalized === "partially paid" ||
    normalized === "partially_paid"
  ) {
    return [161, 98, 7] as [number, number, number];
  }

  return [75, 85, 99] as [number, number, number];
}

export async function buildInvoicePdf(
  invoice: any
) {
  const branding: any =
    await getBranding();

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth =
    pdf.internal.pageSize.getWidth();

  const pageHeight =
    pdf.internal.pageSize.getHeight();

  const margin = 18;

  const primaryColor =
    branding.primaryColor ||
    "#0F0F10";

  const accentColor =
    branding.accentColor ||
    "#D4AF37";

  const currencySymbol =
    branding.currencySymbol ||
    branding.currency ||
    "KES";

  /*
   * ---------------------------------------------------------
   * HEADER
   * ---------------------------------------------------------
   */

  let y = 18;

  const logoUrl =
    branding.invoiceLogo ||
    branding.invoice_logo_url ||
    branding.logo ||
    null;

  /*
   * jsPDF cannot reliably load every remote image URL.
   * Keep the invoice functional even when a logo cannot load.
   */

  if (hasValue(logoUrl)) {
    try {
      pdf.addImage(
        logoUrl,
        "AUTO",
        margin,
        y,
        28,
        18
      );
    } catch {
      // Continue without logo.
    }
  }

  const companyX =
    hasValue(logoUrl)
      ? margin + 34
      : margin;

  const companyName =
    branding.companyName ||
    branding.tradingName ||
    "Property Management";

  pdf.setFontSize(19);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(primaryColor);

  pdf.text(
    safeText(companyName),
    companyX,
    y + 7
  );

  if (
    hasValue(branding.tradingName) &&
    branding.tradingName !== companyName
  ) {
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");

    pdf.text(
      safeText(branding.tradingName),
      companyX,
      y + 13
    );
  }

  let contactY = y + 22;

  const contactParts = [
    branding.address,
    branding.phone,
    branding.email,
    branding.website,
  ].filter(hasValue);

  pdf.setFontSize(8.5);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(90);

  for (const part of contactParts) {
    pdf.text(
      safeText(part),
      companyX,
      contactY
    );

    contactY += 4.5;
  }

  if (hasValue(branding.taxPin)) {
    pdf.text(
      `PIN: ${branding.taxPin}`,
      companyX,
      contactY
    );

    contactY += 4.5;
  }

  /*
   * ---------------------------------------------------------
   * INVOICE TITLE
   * ---------------------------------------------------------
   */

  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(primaryColor);

  pdf.text(
    "INVOICE",
    pageWidth - margin,
    y + 7,
    { align: "right" }
  );

  const status =
    safeText(invoice.status, "Issued");

  const statusRGB =
    statusColor(status);

  const statusWidth = 30;
  const statusHeight = 7;

  pdf.setFillColor(
    ...statusRGB
  );

  pdf.roundedRect(
    pageWidth -
      margin -
      statusWidth,
    y + 13,
    statusWidth,
    statusHeight,
    2,
    2,
    "F"
  );

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);

  pdf.text(
    status.toUpperCase(),
    pageWidth - margin - statusWidth / 2,
    y + 18,
    { align: "center" }
  );

  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(70);

  pdf.setFontSize(8.5);

  const invoiceMeta = [
    [
      "Invoice No.",
      safeText(invoice.invoice_number),
    ],
    [
      "Issue Date",
      formatDate(invoice.invoice_date),
    ],
    [
      "Due Date",
      formatDate(invoice.due_date),
    ],
    [
      "Billing Period",
      safeText(invoice.billing_period),
    ],
  ];

  let metaY = y + 28;

  for (const [label, value] of invoiceMeta) {
    if (!hasValue(value)) continue;

    pdf.setFont("helvetica", "bold");

    pdf.text(
      label,
      pageWidth - margin - 62,
      metaY
    );

    pdf.setFont("helvetica", "normal");

    pdf.text(
      value,
      pageWidth - margin,
      metaY,
      { align: "right" }
    );

    metaY += 5;
  }

  y = Math.max(
    contactY,
    metaY
  ) + 10;

  /*
   * ---------------------------------------------------------
   * GOLD DIVIDER
   * ---------------------------------------------------------
   */

  pdf.setDrawColor(accentColor);
  pdf.setLineWidth(0.8);

  pdf.line(
    margin,
    y,
    pageWidth - margin,
    y
  );

  y += 10;

  /*
   * ---------------------------------------------------------
   * BILL TO / PROPERTY
   * ---------------------------------------------------------
   */

  pdf.setFillColor("#F8FAFC");

  pdf.roundedRect(
    margin,
    y,
    pageWidth - margin * 2,
    38,
    3,
    3,
    "F"
  );

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(accentColor);

  pdf.text(
    "BILL TO",
    margin + 6,
    y + 8
  );

  pdf.text(
    "PROPERTY",
    pageWidth / 2,
    y + 8
  );

  pdf.setFontSize(10);
  pdf.setTextColor(primaryColor);

  const tenantName =
    invoice.tenant_name ||
    "Tenant";

  pdf.setFont("helvetica", "bold");

  pdf.text(
    safeText(tenantName),
    margin + 6,
    y + 15
  );

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8.5);
  pdf.setTextColor(80);

  let tenantY = y + 21;

  const tenantDetails = [
    invoice.tenant_phone,
    invoice.tenant_email,
  ].filter(hasValue);

  for (const detail of tenantDetails) {
    pdf.text(
      safeText(detail),
      margin + 6,
      tenantY
    );

    tenantY += 4.5;
  }

  pdf.setFontSize(10.5);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(primaryColor);

  pdf.text(
    safeText(
      invoice.property_name,
      "Property"
    ),
    pageWidth / 2,
    y + 15
  );

  pdf.setFontSize(8.5);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(80);

  let propertyY = y + 21;

  const propertyDetails = [
    invoice.property_address,
    hasValue(invoice.unit_number)
      ? `Unit ${invoice.unit_number}`
      : "",
  ].filter(hasValue);

  for (const detail of propertyDetails) {
    pdf.text(
      safeText(detail),
      pageWidth / 2,
      propertyY
    );

    propertyY += 4.5;
  }

  y += 45;

  /*
   * ---------------------------------------------------------
   * CHARGES
   * ---------------------------------------------------------
   */

  const items =
    invoice.items ??
    invoice.invoice_items ??
    [];

  const rows = items.map(
    (item: any) => [
      safeText(
        item.description,
        item.item_type || "Charge"
      ),
      safeText(item.quantity, "1"),
      money(
        item.unit_price,
        currencySymbol
      ),
      money(
        item.amount,
        currencySymbol
      ),
    ]
  );

  if (rows.length === 0) {
    rows.push([
      "Invoice charges",
      "1",
      money(
        invoice.amount,
        currencySymbol
      ),
      money(
        invoice.amount,
        currencySymbol
      ),
    ]);
  }

  autoTable(pdf, {
    startY: y,
    margin: {
      left: margin,
      right: margin,
    },
    head: [[
      "Description",
      "Qty",
      "Rate",
      "Amount",
    ]],
    body: rows,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 4.5,
      textColor: [50, 50, 50],
      lineColor: [225, 225, 225],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    columnStyles: {
      0: {
        cellWidth: "auto",
      },
      1: {
        halign: "center",
        cellWidth: 18,
      },
      2: {
        halign: "right",
        cellWidth: 35,
      },
      3: {
        halign: "right",
        cellWidth: 38,
      },
    },
  });

  y =
    ((pdf as any).lastAutoTable?.finalY ??
      y + 20) + 10;

  /*
   * ---------------------------------------------------------
   * TOTALS
   * ---------------------------------------------------------
   */

  const summaryX =
    pageWidth - margin - 78;

  const summaryWidth = 82;

  const subtotal =
    Number(invoice.amount ?? 0);

  const amountPaid =
    Number(invoice.amount_paid ?? 0);

  const balance =
    Number(invoice.balance ?? 0);

  pdf.setFontSize(9);
  pdf.setTextColor(70);

  pdf.text(
    "Invoice Total",
    summaryX,
    y
  );

  pdf.text(
    money(
      subtotal,
      currencySymbol
    ),
    pageWidth - margin,
    y,
    { align: "right" }
  );

  y += 7;

  pdf.text(
    "Paid",
    summaryX,
    y
  );

  pdf.text(
    money(
      amountPaid,
      currencySymbol
    ),
    pageWidth - margin,
    y,
    { align: "right" }
  );

  y += 9;

  pdf.setFillColor(accentColor);

  pdf.roundedRect(
    summaryX - 4,
    y - 5,
    summaryWidth + 4,
    13,
    2,
    2,
    "F"
  );

  pdf.setFontSize(10.5);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(primaryColor);

  pdf.text(
    "BALANCE DUE",
    summaryX,
    y + 3
  );

  pdf.text(
    money(
      balance,
      currencySymbol
    ),
    pageWidth - margin - 3,
    y + 3,
    { align: "right" }
  );

  y += 22;

  /*
   * ---------------------------------------------------------
   * OPTIONAL INVOICE FOOTER / NOTES
   * ---------------------------------------------------------
   */

  if (hasValue(branding.invoiceFooter)) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(90);

    const footerLines =
      pdf.splitTextToSize(
        safeText(branding.invoiceFooter),
        pageWidth - margin * 2
      );

    pdf.text(
      footerLines,
      margin,
      y
    );

    y +=
      footerLines.length * 4.5 + 6;
  }

  /*
   * ---------------------------------------------------------
   * PLATFORM FOOTER
   * ---------------------------------------------------------
   */

  if (!branding.removeRubyBranding) {
    pdf.setDrawColor(220);
    pdf.setLineWidth(0.3);

    pdf.line(
      margin,
      pageHeight - 18,
      pageWidth - margin,
      pageHeight - 18
    );

    pdf.setFontSize(7.5);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(120);

    pdf.text(
      "Powered by Ruby Rental | +254 796 594 295",
      pageWidth / 2,
      pageHeight - 11,
      { align: "center" }
    );
  }

  return pdf;
}
