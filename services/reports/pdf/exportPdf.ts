export type PdfReport = {
  title: string;
  subtitle?: string;
  generatedAt?: string;
  rows: Record<string, any>[];
};

export async function exportPdf(
  report: PdfReport
) {
  console.log(
    "PDF Export",
    report
  );

  alert(
    "PDF export engine coming next.\n\n" +
    report.title
  );
}
