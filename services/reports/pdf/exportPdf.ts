import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export type PdfReport = {
  title: string;
  subtitle?: string;
  generatedAt?: string;

  landlordName?: string;
  landlordPhone?: string;
  landlordEmail?: string;
  landlordAddress?: string;

  rows: Record<string, any>[];

  totals?: Record<string, any>;
};

function formatValue(value: any): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "number") {
    return `KES ${value.toLocaleString("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return String(value);
}

export async function exportPdf(report: PdfReport) {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const gold: [number, number, number] = [212, 175, 55];
  const black: [number, number, number] = [15, 15, 16];
  const gray: [number, number, number] = [100, 100, 100];

  /*
   * ----------------------------------------------------
   * PREMIUM HEADER
   * ----------------------------------------------------
   */

  doc.setFillColor(...black);
  doc.rect(0, 0, pageWidth, 34, "F");

  doc.setTextColor(...gold);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text(
    report.landlordName || "Ruby Rental",
    14,
    15
  );

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);

  const contactParts = [
    report.landlordPhone,
    report.landlordEmail,
    report.landlordAddress,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    doc.text(contactParts.join("  •  "), 14, 23);
  }

  /*
   * ----------------------------------------------------
   * DOCUMENT TITLE
   * ----------------------------------------------------
   */

  doc.setTextColor(...black);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");

  doc.text(report.title, 14, 48);

  if (report.subtitle) {
    doc.setTextColor(...gray);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(report.subtitle, 14, 55);
  }

  doc.setTextColor(...gray);
  doc.setFontSize(8);

  doc.text(
    `Generated: ${
      report.generatedAt ?? new Date().toLocaleString("en-KE")
    }`,
    14,
    63
  );

  /*
   * ----------------------------------------------------
   * REPORT TABLE
   * ----------------------------------------------------
   */

  let startY = 70;

  if (report.rows.length > 0) {
    const headers = Object.keys(report.rows[0]);

    const body = report.rows.map((row) =>
      headers.map((key) => formatValue(row[key]))
    );

    autoTable(doc, {
      startY,
      head: [headers],
      body,

      theme: "grid",

      styles: {
        font: "helvetica",
        fontSize: 8,
        cellPadding: 4,
        textColor: [35, 35, 35],
        lineColor: [225, 225, 225],
        lineWidth: 0.2,
      },

      headStyles: {
        fillColor: gold,
        textColor: black,
        fontStyle: "bold",
        fontSize: 8,
      },

      alternateRowStyles: {
        fillColor: [248, 248, 248],
      },

      margin: {
        left: 14,
        right: 14,
        bottom: 25,
      },
    });
  }

  /*
   * ----------------------------------------------------
   * TOTALS
   * ----------------------------------------------------
   */

  if (report.totals) {
    const finalY =
      (doc as any).lastAutoTable?.finalY ?? startY;

    let y = finalY + 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...black);

    for (const [label, value] of Object.entries(report.totals)) {
      doc.text(label, pageWidth - 75, y);
      doc.text(
        formatValue(value),
        pageWidth - 14,
        y,
        { align: "right" }
      );

      y += 6;
    }
  }

  /*
   * ----------------------------------------------------
   * FOOTER ON EVERY PAGE
   * ----------------------------------------------------
   */

  const totalPages = doc.getNumberOfPages();

  for (let page = 1; page <= totalPages; page++) {
    doc.setPage(page);

    doc.setDrawColor(...gold);
    doc.setLineWidth(0.3);

    doc.line(
      14,
      pageHeight - 17,
      pageWidth - 14,
      pageHeight - 17
    );

    doc.setTextColor(...gray);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);

    doc.text(
      "Ruby Rental",
      14,
      pageHeight - 10
    );

    doc.text(
      "Property Management System",
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );

    doc.text(
      `Page ${page} of ${totalPages}`,
      pageWidth - 14,
      pageHeight - 10,
      { align: "right" }
    );
  }

  /*
   * ----------------------------------------------------
   * DOWNLOAD
   * ----------------------------------------------------
   */

  const safeTitle = report.title
    .replace(/[^a-z0-9]+/gi, "_")
    .replace(/^_+|_+$/g, "");

  doc.save(`${safeTitle || "Ruby_Rental_Report"}.pdf`);
}
