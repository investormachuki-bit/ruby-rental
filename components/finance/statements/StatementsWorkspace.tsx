"use client";

import { useEffect, useMemo, useState } from "react";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

import StatementFilters from "./StatementFilters";
import StatementSummary from "./StatementSummary";
import StatementLedger from "./StatementLedger";
import StatementLeaseSelector from "./StatementLeaseSelector";

import { getLeases } from "@/services/leases/getLeases";
import { getTenantStatement } from "@/services/statements/getTenantStatement";
import { getPropertyStatement } from "@/services/statements/getPropertyStatement";
import { getUnitStatement } from "@/services/statements/getUnitStatement";
import { getAccountStatement } from "@/services/statements/getAccountStatement";
import { exportPdf } from "@/services/reports/pdf/exportPdf";
import { exportExcel } from "@/services/reports/excel/exportExcel";

const statementTypes = [
  "Tenant Statement",
  "Property Statement",
  "Unit Statement",
  "Account Statement",
] as const;

type StatementType = (typeof statementTypes)[number];

export default function StatementsWorkspace() {
  const [selectedType, setSelectedType] = useState<StatementType>(
    statementTypes[0]
  );
  const [leases, setLeases] = useState<any[]>([]);
  const [selectedLease, setSelectedLease] = useState("");
  const [statement, setStatement] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getLeases();
        setLeases(data);
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, []);

  async function generateStatement() {
    if (!selectedLease) {
      alert("Select a lease.");
      return;
    }

    const lease = leases.find((l) => l.id === selectedLease);
    if (!lease) return;

    const tenantName =
      lease.tenant?.full_name ??
      `${lease.tenant?.first_name ?? ""} ${lease.tenant?.last_name ?? ""}`.trim();

    const propertyName = lease.property?.name ?? "Property";
    const unitNumber = lease.unit?.unit_number ?? "Unit";

    let result: any = null;

    switch (selectedType) {
      case "Tenant Statement":
        result = await getTenantStatement(selectedLease, tenantName);
        break;
      case "Property Statement":
        result = await getPropertyStatement(selectedLease, propertyName);
        break;
      case "Unit Statement":
        result = await getUnitStatement(selectedLease, unitNumber);
        break;
      case "Account Statement":
        result = await getAccountStatement(selectedLease);
        break;
    }

    setStatement(result);
  }

  async function exportCurrentPdf() {
    if (!statement) return;

    await exportPdf({
      title: statement.title,
      subtitle: statement.reference,
      rows: statement.transactions,
    });
  }

  async function exportCurrentExcel() {
    if (!statement) return;

    await exportExcel({
      fileName: statement.reference,
      rows: statement.transactions,
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statementTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "primary" : "secondary"}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </Button>
          ))}
        </div>
      </Card>

      <StatementFilters />

      <StatementLeaseSelector
        leases={leases}
        value={selectedLease}
        onChange={setSelectedLease}
        statementType={selectedType}
      />

      <Button onClick={generateStatement}>Generate Statement</Button>

      {statement && (
        <>
          <StatementSummary statement={statement} />
          <StatementLedger statement={statement} />

          <div className="flex gap-3">
            <Button onClick={exportCurrentPdf}>Export PDF</Button>
            <Button variant="secondary" onClick={exportCurrentExcel}>
              Export Excel
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
