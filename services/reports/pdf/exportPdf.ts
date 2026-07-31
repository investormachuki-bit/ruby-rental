import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export type PdfReport = {
  title: string;
  subtitle?: string;
  generatedAt?: string;
  rows: Record<string, any>[];
};

export async function exportPdf(
  report: PdfReport
) {

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(report.title, 14, 18);

  if (report.subtitle) {
    doc.setFontSize(11);
    doc.text(report.subtitle, 14, 26);
  }

  doc.setFontSize(9);

  doc.text(
    `Generated: ${
      report.generatedAt ??
      new Date().toLocaleString()
    }`,
    14,
    34
  );

  if (report.rows.length > 0) {

    const headers = Object.keys(
      report.rows[0]
    );

    const body = report.rows.map((row) =>
      headers.map((key) => row[key])
    );

    autoTable(doc, {
      startY: 42,
      head: [headers],
      body,
      styles: {
        fontSize: 8,
      },
      headStyles: {
        fillColor: [212, 175, 55],
        textColor: 0,
      },
    });

  }

  doc.save(
    `${report.title.replace(/\s+/g, "_")}.pdf`
  );

}
