import * as XLSX from "xlsx";

import { getBranding } from "@/services/branding/getBranding";

export type ExcelReport = {
  fileName: string;
  title?: string;
  subtitle?: string;
  generatedAt?: string;
  rows: Record<string, any>[];
  totals?: Record<string, any>;
};

function formatValue(value: any) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  return value;
}

export async function exportExcel(
  report: ExcelReport
) {
  const branding = await getBranding();

  const workbook = XLSX.utils.book_new();

  const title =
    report.title ??
    report.fileName
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const generatedAt =
    report.generatedAt ??
    new Date().toLocaleString("en-KE");

  const currency =
    branding.currencySymbol ||
    branding.currency ||
    "KES";

  /*
   * --------------------------------------------------
   * DOCUMENT DATA
   * --------------------------------------------------
   */

  const rows: any[][] = [];

  rows.push([
    branding.companyName ||
      "Ruby Rental",
  ]);

  rows.push([
    branding.tradingName ||
      "Property Management System",
  ]);

  const contact = [
    branding.address,
    branding.phone,
    branding.email,
  ]
    .filter(Boolean)
    .join("  •  ");

  if (contact) {
    rows.push([contact]);
  }

  rows.push([]);

  rows.push([title]);

  if (report.subtitle) {
    rows.push([report.subtitle]);
  }

  rows.push([
    `Generated: ${generatedAt}`,
  ]);

  rows.push([]);

  /*
   * --------------------------------------------------
   * TABLE
   * --------------------------------------------------
   */

  if (report.rows.length > 0) {
    const headers =
      Object.keys(report.rows[0]);

    rows.push(headers);

    for (const row of report.rows) {
      rows.push(
        headers.map((key) =>
          formatValue(row[key])
        )
      );
    }
  }

  /*
   * --------------------------------------------------
   * TOTALS
   * --------------------------------------------------
   */

  if (report.totals) {
    rows.push([]);
    rows.push([
      "SUMMARY",
    ]);

    for (
      const [label, value]
      of Object.entries(
        report.totals
      )
    ) {
      rows.push([
        label,
        value,
      ]);
    }
  }

  rows.push([]);

  rows.push([
    `Powered by Ruby Rental | +254 796 594 295`,
  ]);

  rows.push([
    "Property Management System",
  ]);

  /*
   * --------------------------------------------------
   * WORKSHEET
   * --------------------------------------------------
   */

  const worksheet =
    XLSX.utils.aoa_to_sheet(rows);

  /*
   * --------------------------------------------------
   * COLUMN WIDTHS
   * --------------------------------------------------
   */

  const columnCount =
    Math.max(
      ...rows.map(
        (row) => row.length
      ),
      2
    );

  worksheet["!cols"] =
    Array.from(
      { length: columnCount },
      (_, index) => ({
        wch:
          index === 0
            ? 28
            : 20,
      })
    );

  /*
   * --------------------------------------------------
   * MERGE HEADER / BRANDING
   * --------------------------------------------------
   */

  worksheet["!merges"] = [
    {
      s: { r: 0, c: 0 },
      e: {
        r: 0,
        c: columnCount - 1,
      },
    },
    {
      s: { r: 1, c: 0 },
      e: {
        r: 1,
        c: columnCount - 1,
      },
    },
    {
      s: { r: 4, c: 0 },
      e: {
        r: 4,
        c: columnCount - 1,
      },
    },
  ];

  /*
   * --------------------------------------------------
   * PREMIUM STYLING
   * --------------------------------------------------
   */

  const primary =
    branding.primaryColor ||
    "#0F0F10";

  const gold =
    branding.secondaryColor ||
    "#D4AF37";

  function styleCell(
    address: string,
    style: any
  ) {
    if (!worksheet[address]) {
      worksheet[address] = {
        v: "",
        t: "s",
      };
    }

    worksheet[address].s =
      style;
  }

  /*
   * Company name
   */

  styleCell("A1", {
    font: {
      bold: true,
      sz: 18,
      color: {
        rgb: "D4AF37",
      },
    },
    fill: {
      fgColor: {
        rgb: primary.replace(
          "#",
          ""
        ),
      },
    },
    alignment: {
      vertical: "center",
    },
  });

  /*
   * Company / system line
   */

  styleCell("A2", {
    font: {
      bold: true,
      sz: 10,
      color: {
        rgb: "FFFFFF",
      },
    },
    fill: {
      fgColor: {
        rgb: primary.replace(
          "#",
          ""
        ),
      },
    },
  });

  /*
   * Header rows
   */

  const headerRow =
    report.rows.length > 0
      ? 8
      : -1;

  if (headerRow >= 0) {
    const headers =
      Object.keys(
        report.rows[0]
      );

    headers.forEach(
      (_, index) => {
        const address =
          XLSX.utils.encode_cell({
            r: headerRow,
            c: index,
          });

        styleCell(
          address,
          {
            font: {
              bold: true,
              color: {
                rgb: "FFFFFF",
              },
            },
            fill: {
              fgColor: {
                rgb: primary.replace(
                  "#",
                  ""
                ),
              },
            },
            alignment: {
              vertical: "center",
              horizontal:
                "center",
              wrapText: true,
            },
            border: {
              bottom: {
                style: "medium",
                color: {
                  rgb: gold.replace(
                    "#",
                    ""
                  ),
                },
              },
            },
          }
        );
      }
    );

    /*
     * Data rows
     */

    for (
      let row = headerRow + 1;
      row <
      headerRow +
        1 +
        report.rows.length;
      row++
    ) {
      for (
        let col = 0;
        col < headers.length;
        col++
      ) {
        const address =
          XLSX.utils.encode_cell({
            r: row,
            c: col,
          });

        styleCell(
          address,
          {
            alignment: {
              vertical: "center",
            },
            border: {
              bottom: {
                style: "thin",
                color: {
                  rgb: "E5E7EB",
                },
              },
            },
          }
        );
      }
    }
  }

  /*
   * Footer styling
   */

  const footerStart =
    rows.length - 2;

  for (
    let row = footerStart;
    row < rows.length;
    row++
  ) {
    const address =
      XLSX.utils.encode_cell({
        r: row,
        c: 0,
      });

    styleCell(
      address,
      {
        font: {
          italic: true,
          color: {
            rgb: "6B7280",
          },
        },
      }
    );
  }

  /*
   * --------------------------------------------------
   * FREEZE REPORT HEADER
   * --------------------------------------------------
   */

  worksheet["!freeze"] = {
    xSplit: 0,
    ySplit: 9,
  };

  /*
   * --------------------------------------------------
   * WORKBOOK
   * --------------------------------------------------
   */

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Report"
  );

  const safeFileName =
    report.fileName
      .replace(
        /[^a-z0-9]+/gi,
        "_"
      )
      .replace(
        /^_+|_+$/g,
        "");

  XLSX.writeFile(
    workbook,
    `${
      safeFileName ||
      "Ruby_Rental_Report"
    }.xlsx`
  );
}
