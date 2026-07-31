import * as XLSX from "xlsx";

export type ExcelReport = {
  fileName: string;
  rows: Record<string, any>[];
};

export async function exportExcel(
  report: ExcelReport
) {

  const workbook =
    XLSX.utils.book_new();

  const worksheet =
    XLSX.utils.json_to_sheet(
      report.rows
    );

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Report"
  );

  XLSX.writeFile(
    workbook,
    `${report.fileName.replace(/\s+/g, "_")}.xlsx`
  );

}
