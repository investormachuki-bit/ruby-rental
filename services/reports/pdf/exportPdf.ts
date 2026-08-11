import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { getBranding } from "@/services/branding/getBranding";

export type PdfReport = {
  title: string;
  subtitle?: string;
  generatedAt?: string;
  rows: Record<string, any>[];
  totals?: Record<string, any>;
};

function text(value: unknown, fallback = "-") {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return fallback;
  }

  return String(value);
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

function formatValue(
  value: unknown,
  currencySymbol: string
) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  if (typeof value === "number") {
    return money(value, currencySymbol);
  }

  return String(value);
}

export async function exportPdf(
  report: PdfReport
) {
  const branding = await getBranding();

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

  const gold =
    branding.secondaryColor || "#D4AF37";

  const logoUrl =
    branding.invoiceLogo ||
    branding.logo ||
    null;

  /*
   * HEADER
   */

  let y = 18;

  if (logoUrl) {
    try {
      pdf.addImage(
        logoUrl,
        "AUTO",
        margin,
        y,
        26,
        18
      );
    } catch {
      // Continue without logo.
    }
  }

  const companyX =
    logoUrl
      ? margin + 32
      : margin;

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(18);

  pdf.setTextColor(
    primaryColor
  );

  pdf.text(
    text(
      branding.companyName,
      "Ruby Rental"
    ),
    companyX,
    y + 7
  );

  if (
    branding.tradingName &&
    branding.tradingName !==
      branding.companyName
  ) {
    pdf.setFontSize(8.5);
    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setTextColor(90);

    pdf.text(
      branding.tradingName,
      companyX,
      y + 12
    );
  }

  pdf.setFontSize(8);

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setTextColor(90);

  const contactParts = [
    branding.address,
    branding.phone,
    branding.email,
    branding.website,
  ].filter(Boolean);

  if (contactParts.length) {
    pdf.text(
      contactParts.join("  •  "),
      companyX,
      y + 19
    );
  }

  /*
   * REPORT TITLE
   */

  const titleY = Math.max(
    y + 30,
    48
  );

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(22);

  pdf.setTextColor(
    primaryColor
  );

  pdf.text(
    report.title,
    margin,
    titleY
  );

  if (report.subtitle) {
    pdf.setFont(
      "helvetica",
      "normal"
    );

    pdf.setFontSize(9);

    pdf.setTextColor(90);

    pdf.text(
      report.subtitle,
      margin,
      titleY + 7
    );
  }

  pdf.setFontSize(8);

  pdf.setTextColor(100);

  pdf.text(
    `Generated: ${
      report.generatedAt ??
      new Date().toLocaleString("en-KE")
    }`,
    margin,
    titleY + 14
  );

  /*
   * GOLD DIVIDER
   */

  const dividerY =
    titleY + 20;

  pdf.setDrawColor(gold);

  pdf.setLineWidth(0.8);

  pdf.line(
    margin,
    dividerY,
    pageWidth - margin,
    dividerY
  );

  /*
   * INFORMATION PANEL
   */

  const panelY =
    dividerY + 8;

  pdf.setFillColor("#F8FAFC");

  pdf.roundedRect(
    margin,
    panelY,
    pageWidth - margin * 2,
    19,
    3,
    3,
    "F"
  );

  pdf.setFont(
    "helvetica",
    "bold"
  );

  pdf.setFontSize(8);

  pdf.setTextColor(gold);

  pdf.text(
    "REPORT",
    margin + 6,
    panelY + 7
  );

  pdf.setFont(
    "helvetica",
    "normal"
  );

  pdf.setTextColor(
    primaryColor
  );

  pdf.setFontSize(9);

  pdf.text(
    report.title,
    margin + 6,
    panelY + 13
  );

  pdf.setTextColor(90);

  pdf.text(
    `Currency: ${
      branding.currencySymbol ||
      branding.currency ||
      "KES"
    }`,
    pageWidth - margin - 6,
    panelY + 10,
    { align: "right" }
  );

  /*
   * TABLE
   */

  let tableY =
    panelY + 28;

  if (report.rows.length > 0) {
    const headers =
      Object.keys(report.rows[0]);

    const body =
      report.rows.map(
        (row) =>
          headers.map(
            (key) =>
              formatValue(
                row[key],
                branding.currencySymbol ||
                  branding.currency ||
                  "KES"
              )
          )
      );

    autoTable(pdf, {
      startY: tableY,

      margin: {
        left: margin,
        right: margin,
        bottom: 25,
      },

      head: [headers],

      body,

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 4,
        textColor: [45, 45, 45],
        lineColor: [225, 225, 225],
        lineWidth: 0.2,
      },

      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 8,
      },

      alternateRowStyles: {
        fillColor: [248, 248, 248],
      },
    });

    tableY =
      ((pdf as any).lastAutoTable
        ?.finalY ?? tableY) + 10;
  }

  /*
   * TOTALS
   */

  if (report.totals) {
    const totalWidth = 82;
    const totalX =
      pageWidth -
      margin -
      totalWidth;

    const totalHeight =
      Object.keys(report.totals).length *
        7 +
      10;

    pdf.setFillColor("#F8FAFC");

    pdf.roundedRect(
      totalX,
      tableY,
      totalWidth,
      totalHeight,
      3,
      3,
      "F"
    );

    let totalY =
      tableY + 7;

    for (
      const [label, value]
      of Object.entries(
        report.totals
      )
    ) {
      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(8);

      pdf.setTextColor(70);

      pdf.text(
        label,
        totalX + 5,
        totalY
      );

      pdf.setTextColor(
        primaryColor
      );

      pdf.text(
        formatValue(
          value,
          branding.currencySymbol ||
            branding.currency ||
            "KES"
        ),
        pageWidth - margin - 5,
        totalY,
        { align: "right" }
      );

      totalY += 7;
    }
  }

  /*
   * FOOTER
   */

  const totalPages =
    pdf.getNumberOfPages();

  for (
    let page = 1;
    page <= totalPages;
    page++
  ) {
    pdf.setPage(page);

    pdf.setDrawColor(gold);

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

    pdf.setFontSize(7);

    pdf.setTextColor(110);

    pdf.text(
      `Powered by Ruby Rental | +254 796 594 295`,
      margin,
      pageHeight - 11
    );

    pdf.text(
      "Property Management System",
      pageWidth / 2,
      pageHeight - 11,
      { align: "center" }
    );

    pdf.text(
      `Page ${page} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 11,
      { align: "right" }
    );
  }

  const safeTitle =
    report.title
      .replace(
        /[^a-z0-9]+/gi,
        "_"
      )
      .replace(
        /^_+|_+$/g,
        ""
      );

  pdf.save(
    `${safeTitle || "Ruby_Rental_Report"}.pdf`
  );
}
