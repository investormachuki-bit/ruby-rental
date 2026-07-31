export type ExcelReport = {
  fileName: string;
  rows: Record<string, any>[];
};

export async function exportExcel(
  report: ExcelReport
) {
  console.log(
    "Excel Export",
    report
  );

  alert(
    "Excel export engine coming next.\n\n" +
    report.fileName
  );
}
