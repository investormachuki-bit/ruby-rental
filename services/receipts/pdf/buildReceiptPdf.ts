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
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const primaryColor = branding.primaryColor || "#111827";
  const currency = branding.currencySymbol || branding.currency || "KES";

  const payment = data.payment ?? {};
  const tenant = data.tenant ?? {};
  const property = data.property ?? {};
  const unit = data.unit ?? {};

  pdf.setTextColor(primaryColor);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text(safeText(branding.tradingName || branding.companyName || "Ruby Rental"), 20, 20);

  const headerLines = [
    branding.physicalAddress || branding.address,
    branding.phone,
    branding.email,
    branding.website,
  ].map(safeText).filter(Boolean);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(90);

  let y = 28;
  for (const line of headerLines) {
    pdf.text(line, 20, y);
    y += 5;
  }

  pdf.setTextColor(0);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(24);
  pdf.text("RECEIPT", 150, 20);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(`Receipt No: ${safeText(data.receipt_number)}`, 150, 28);
  pdf.text(`Date: ${safeText(data.receipt_date)}`, 150, 34);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text("Received From", 20, 65);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  const tenantName = safeText(tenant.full_name) || `${safeText(tenant.first_name)} ${safeText(tenant.last_name)}`.trim() || "Tenant";
  pdf.text(tenantName, 20, 72);
  if (safeText(tenant.phone)) pdf.text(safeText(tenant.phone), 20, 78);
  if (safeText(tenant.email)) pdf.text(safeText(tenant.email), 20, 84);
  if (safeText(property.name)) pdf.text(safeText(property.name), 20, 90);
  if (safeText(unit.unit_number)) pdf.text(`Unit ${safeText(unit.unit_number)}`, 20, 96);

  const rows: string[][] = [];
  if (safeText(payment.payment_type)) rows.push(["Payment Type", safeText(payment.payment_type)]);
  if (safeText(payment.payment_method)) rows.push(["Payment Method", safeText(payment.payment_method)]);
  if (safeText(payment.reference_number)) rows.push(["Reference", safeText(payment.reference_number)]);
  rows.push(["Amount Received", money(data.amount, currency)]);

  autoTable(pdf, {
    startY: 104,
    head: [["Description", "Details"]],
    body: rows,
    theme: "grid",
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: primaryColor, textColor: 255 },
  });

  let currentY = ((pdf as any).lastAutoTable?.finalY ?? 104) + 12;

  const notes = safeText(data.notes) || safeText(payment.notes);
  if (notes) {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text("Notes", 20, currentY);
    currentY += 6;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    const noteLines = pdf.splitTextToSize(notes, 170);
    pdf.text(noteLines, 20, currentY);
    currentY += noteLines.length * 4 + 8;
  }

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.text(`TOTAL RECEIVED: ${money(data.amount, currency)}`, 20, currentY + 5);

  if (!branding.removeRubyBranding) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(110);
    pdf.text("Powered by Ruby Rental • +254 796 594 295", 20, 285);
  }

  return pdf;
}
