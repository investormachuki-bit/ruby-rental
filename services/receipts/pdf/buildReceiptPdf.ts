import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { getBranding } from "@/services/branding/getBranding";

function safeText(
  value: unknown,
  fallback = ""
) {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  return String(value).trim();
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
  currency = "KES"
) {
  return `${currency} ${Number(
    value ?? 0
  ).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: unknown) {
  if (!hasValue(value)) return "";

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-GB");
}

export async function buildReceiptPdf(
  data: any
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
    branding.primaryColor || "#0F0F10";

  const accentColor =
    branding.accentColor || "#D4AF37";

  const currency =
    branding.currencySymbol ||
    branding.currency ||
    "KES";

  const payment =
    data.payment ?? {};

  const tenant =
    data.tenant ?? {};

  const property =
    data.property ?? {};

  const unit =
    data.unit ?? {};

  const allocations =
    payment.allocations ?? [];

  /* HEADER */

  let y = 18;

  const logoUrl =
    branding.invoiceLogo ||
    branding.invoice_logo_url ||
    branding.logo ||
    null;

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

  pdf.setFont(
    "helvetica",
    "bold"
  );
  pdf.setFontSize(19);
  pdf.setTextColor(primaryColor);

  pdf.text(
    safeText(companyName),
    companyX,
    y + 7
  );

  let contactY = y + 22;

  const contactParts = [
    branding.address,
    branding.phone,
    branding.email,
    branding.website,
  ].filter(hasValue);

  pdf.setFont(
    "helvetica",
    "normal"
  );
  pdf.setFontSize(8.5);
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

  /* RECEIPT TITLE */

  pdf.setFont(
    "helvetica",
    "bold"
  );
  pdf.setFontSize(24);
  pdf.setTextColor(primaryColor);

  pdf.text(
    "RECEIPT",
    pageWidth - margin,
    y + 7,
    { align: "right" }
  );

  pdf.setFont(
    "helvetica",
    "normal"
  );
  pdf.setFontSize(8.5);
  pdf.setTextColor(70);

  const receiptMeta = [
    [
      "Receipt No.",
      safeText(
        data.receipt_number,
        "-"
      ),
    ],
    [
      "Date",
      formatDate(
        data.receipt_date
      ),
    ],
  ];

  let metaY = y + 17;

  for (const [label, value] of receiptMeta) {
    pdf.setFont(
      "helvetica",
      "bold"
    );

    pdf.text(
      label,
      pageWidth - margin - 50,
      metaY
    );

    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.text(
      value,
      pageWidth - margin,
      metaY,
      { align: "right" }
    );

    metaY += 5;
  }

  y =
    Math.max(
      contactY,
      metaY
    ) + 9;

  /* GOLD DIVIDER */

  pdf.setDrawColor(
    accentColor
  );
  pdf.setLineWidth(0.8);

  pdf.line(
    margin,
    y,
    pageWidth - margin,
    y
  );

  y += 9;

  /* TENANT / PROPERTY */

  pdf.setFillColor("#F8FAFC");

  pdf.roundedRect(
    margin,
    y,
    pageWidth - margin * 2,
    39,
    3,
    3,
    "F"
  );

  pdf.setFont(
    "helvetica",
    "bold"
  );
  pdf.setFontSize(8);
  pdf.setTextColor(accentColor);

  pdf.text(
    "RECEIVED FROM",
    margin + 6,
    y + 8
  );

  pdf.text(
    "PROPERTY",
    pageWidth / 2,
    y + 8
  );

  const tenantName =
    safeText(
      tenant.full_name
    ) ||
    `${safeText(
      tenant.first_name
    )} ${safeText(
      tenant.last_name
    )}`.trim() ||
    "Tenant";

  pdf.setFontSize(10.5);
  pdf.setFont(
    "helvetica",
    "bold"
  );
  pdf.setTextColor(primaryColor);

  pdf.text(
    tenantName,
    margin + 6,
    y + 16
  );

  pdf.setFontSize(8.5);
  pdf.setFont(
    "helvetica",
    "normal"
  );
  pdf.setTextColor(80);

  let tenantY = y + 22;

  const tenantDetails = [
    tenant.phone,
    tenant.email,
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
  pdf.setFont(
    "helvetica",
    "bold"
  );
  pdf.setTextColor(primaryColor);

  pdf.text(
    safeText(
      property.name,
      "Property"
    ),
    pageWidth / 2,
    y + 16
  );

  pdf.setFontSize(8.5);
  pdf.setFont(
    "helvetica",
    "normal"
  );
  pdf.setTextColor(80);

  let propertyY = y + 22;

  if (
    hasValue(unit.unit_number)
  ) {
    pdf.text(
      `Unit ${unit.unit_number}`,
      pageWidth / 2,
      propertyY
    );

    propertyY += 4.5;
  }

  if (
    hasValue(property.address)
  ) {
    pdf.text(
      safeText(
        property.address
      ),
      pageWidth / 2,
      propertyY
    );
  }

  y += 48;

  /* PAYMENT DETAILS */

  const paymentRows: string[][] = [];

  if (
    hasValue(
      payment.payment_type
    )
  ) {
    paymentRows.push([
      "Payment Type",
      safeText(
        payment.payment_type
      ),
    ]);
  }

  if (
    hasValue(
      payment.payment_method
    )
  ) {
    paymentRows.push([
      "Payment Method",
      safeText(
        payment.payment_method
      ),
    ]);
  }

  if (
    hasValue(
      payment.reference_number
    )
  ) {
    paymentRows.push([
      "Reference",
      safeText(
        payment.reference_number
      ),
    ]);
  }

  paymentRows.push([
    "Amount Received",
    money(
      data.amount,
      currency
    ),
  ]);

  autoTable(pdf, {
    startY: y,
    margin: {
      left: margin,
      right: margin,
    },
    head: [
      ["Payment Details", "Details"],
    ],
    body: paymentRows,
    theme: "grid",
    styles: {
      font: "helvetica",
      fontSize: 9,
      cellPadding: 4,
      lineColor: [225, 225, 225],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
  });

  y =
    ((pdf as any)
      .lastAutoTable
      ?.finalY ?? y + 25) + 10;

  /* ALLOCATION */

  if (allocations.length > 0) {
    pdf.setFont(
      "helvetica",
      "bold"
    );
    pdf.setFontSize(11);
    pdf.setTextColor(primaryColor);

    pdf.text(
      "PAYMENT ALLOCATION",
      margin,
      y
    );

    y += 5;

    const allocationRows =
      allocations.map(
        (allocation: any) => {
          const invoice =
            allocation.invoice ??
            {};

          return [
            safeText(
              invoice.invoice_number,
              "-"
            ),
            money(
              invoice.amount,
              invoice.currency ||
                currency
            ),
            money(
              allocation.allocated_amount,
              invoice.currency ||
                currency
            ),
            money(
              invoice.balance,
              invoice.currency ||
                currency
            ),
          ];
        }
      );

    autoTable(pdf, {
      startY: y,
      margin: {
        left: margin,
        right: margin,
      },
      head: [[
        "Invoice",
        "Invoice Total",
        "Applied",
        "Balance",
      ]],
      body: allocationRows,
      theme: "grid",
      styles: {
        font: "helvetica",
        fontSize: 8.5,
        cellPadding: 4,
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
          halign: "right",
        },
        2: {
          halign: "right",
        },
        3: {
          halign: "right",
        },
      },
    });

    y =
      ((pdf as any)
        .lastAutoTable
        ?.finalY ?? y + 20) + 9;
  }

  /* PAYMENT SUMMARY */

  const received =
    Number(data.amount ?? 0);

  const allocated =
    Number(
      payment.allocated_amount ?? 0
    );

  const unallocated =
    Number(
      payment.unallocated_amount ??
        Math.max(
          received - allocated,
          0
        )
    );

  pdf.setFillColor("#F8FAFC");

  pdf.roundedRect(
    margin,
    y,
    pageWidth - margin * 2,
    34,
    3,
    3,
    "F"
  );

  pdf.setFont(
    "helvetica",
    "bold"
  );
  pdf.setFontSize(8);
  pdf.setTextColor(accentColor);

  pdf.text(
    "PAYMENT SUMMARY",
    margin + 6,
    y + 8
  );

  pdf.setFont(
    "helvetica",
    "normal"
  );
  pdf.setFontSize(9);
  pdf.setTextColor(70);

  pdf.text(
    "Total Received",
    margin + 6,
    y + 17
  );

  pdf.text(
    money(
      received,
      currency
    ),
    pageWidth - margin - 6,
    y + 17,
    { align: "right" }
  );

  pdf.text(
    "Applied to Invoices",
    margin + 6,
    y + 25
  );

  pdf.text(
    money(
      allocated,
      currency
    ),
    pageWidth - margin - 6,
    y + 25,
    { align: "right" }
  );

  y += 40;

  /* OVERPAYMENT / CREDIT */

  if (unallocated > 0) {
    pdf.setFillColor(
      254,
      249,
      195
    );

    pdf.roundedRect(
      margin,
      y,
      pageWidth - margin * 2,
      18,
      3,
      3,
      "F"
    );

    pdf.setFont(
      "helvetica",
      "bold"
    );
    pdf.setFontSize(9);
    pdf.setTextColor(
      120,
      80,
      0
    );

    pdf.text(
      "TENANT CREDIT / OVERPAYMENT",
      margin + 6,
      y + 7
    );

    pdf.setFontSize(11);

    pdf.text(
      money(
        unallocated,
        currency
      ),
      pageWidth - margin - 6,
      y + 11,
      { align: "right" }
    );

    y += 27;
  }

  /* INVOICE BALANCE */

const activeAllocations = allocations.filter(
  (allocation: any) =>
    allocation?.invoice &&
    !allocation?.is_reversed
);

if (activeAllocations.length > 0) {
  const totalInvoiceBalance =
    activeAllocations.reduce(
      (sum: number, allocation: any) =>
        sum +
        Number(
          allocation.invoice?.balance ?? 0
        ),
      0
    );

  pdf.setFillColor("#F8FAFC");

  pdf.roundedRect(
    margin,
    y,
    pageWidth - margin * 2,
    18,
    3,
    3,
    "F"
  );

  pdf.setFont(
    "helvetica",
    "bold"
  );
  pdf.setFontSize(9);
  pdf.setTextColor(primaryColor);

  pdf.text(
    activeAllocations.length === 1
      ? "INVOICE BALANCE AFTER PAYMENT"
      : "TOTAL INVOICE BALANCE AFTER PAYMENT",
    margin + 6,
    y + 7
  );

  pdf.setFontSize(11);

  pdf.text(
    money(
      totalInvoiceBalance,
      currency
    ),
    pageWidth - margin - 6,
    y + 11,
    { align: "right" }
  );

  y += 27;
}

/* NOTES */
  /* NOTES */

  const notes =
    safeText(data.notes) ||
    safeText(payment.notes);

  if (notes) {
    pdf.setFont(
      "helvetica",
      "bold"
    );
    pdf.setFontSize(9);
    pdf.setTextColor(primaryColor);

    pdf.text(
      "Notes",
      margin,
      y
    );

    y += 5;

    pdf.setFont(
      "helvetica",
      "normal"
    );
    pdf.setFontSize(8.5);
    pdf.setTextColor(90);

    const noteLines =
      pdf.splitTextToSize(
        notes,
        pageWidth -
          margin * 2
      );

    pdf.text(
      noteLines,
      margin,
      y
    );
  }

  /* FOOTER */

  if (
    !branding.removeRubyBranding
  ) {
    pdf.setDrawColor(220);
    pdf.setLineWidth(0.3);

    pdf.line(
      margin,
      pageHeight - 18,
      pageWidth - margin,
      pageHeight - 18
    );

    pdf.setFont(
      "helvetica",
      "normal"
    );
    pdf.setFontSize(7.5);
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
