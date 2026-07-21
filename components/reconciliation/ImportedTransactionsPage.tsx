"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import Breadcrumb from "@/components/common/Breadcrumb";
import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import EmptyState from "@/components/ui/EmptyState";
import { importStatement } from "@/services/reconciliation/importStatement";
import { supabase } from "@/lib/supabase";
import { Upload, Search, CheckCircle2, AlertTriangle, Copy, CircleDollarSign } from "lucide-react";

import ImportStatementModal from "@/components/reconciliation/ImportStatementModal";
import ImportedTransactionsTable from "@/components/reconciliation/ImportedTransactionsTable";
import ReviewQueue from "@/components/reconciliation/ReviewQueue";

export default function ImportedTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    void loadTransactions();
  }, [refreshKey]);

  async function loadTransactions() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reconciliation_transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleImport(file: File, sourceType: string) {
    const text = await file.text();
    const rows = text
      .split(/\r?\n/)
      .filter(Boolean)
      .slice(1)
      .map((line) => line.split(",").map((part) => part.trim()));

    const transactions = rows.map((row) => ({
      transaction_date: row[0] ?? "",
      amount: Number(row[1] ?? 0),
      reference_number: row[2] ?? null,
      transaction_code: row[3] ?? null,
      narration: row[4] ?? null,
      sender_name: row[5] ?? null,
      phone_number: row[6] ?? null,
      bank_account: row[7] ?? null,
    }));

    await importStatement({
      sourceType,
      sourceName: file.name,
      transactions,
    });

    setModalOpen(false);
    setRefreshKey((value) => value + 1);
  }

  const stats = useMemo(() => {
    const imported = transactions.filter((item) => item.status === "Imported").length;
    const matched = transactions.filter((item) => item.status === "Reconciled").length;
    const review = transactions.filter((item) => item.status === "Needs Review").length;
    const duplicates = transactions.filter((item) => item.matching_decision === "Duplicate").length;
    const today = transactions.filter((item) => {
      const date = new Date(item.created_at ?? "");
      return !Number.isNaN(date.getTime()) && date.toDateString() === new Date().toDateString();
    }).length;

    return { imported, matched, review, duplicates, today };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const keyword = search.toLowerCase();
    return transactions.filter((item) => {
      const haystack = [
        item.reference_number,
        item.narration,
        item.sender_name,
        item.phone_number,
        item.bank_account,
        item.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(keyword);
    });
  }, [transactions, search]);

  return (
    <AppShell>
      <PageContainer>
        <Breadcrumb items={[{ label: "Dashboard", href: "/" }, { label: "Reconciliation" }]} />
        <PageHeader title="Financial Reconciliation" description="Import bank and payment statements, review matches and reconcile tenant payments.">
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <Upload size={16} className="mr-2" />
            Import Statement
          </Button>
        </PageHeader>

        <Section>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Card>
              <div className="flex items-center gap-3">
                <CircleDollarSign className="h-5 w-5 text-[#D4AF37]" />
                <div>
                  <p className="text-sm text-gray-500">Imported</p>
                  <p className="text-2xl font-semibold">{stats.imported}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Automatically Matched</p>
                  <p className="text-2xl font-semibold">{stats.matched}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm text-gray-500">Needs Review</p>
                  <p className="text-2xl font-semibold">{stats.review}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <Copy className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Duplicates</p>
                  <p className="text-2xl font-semibold">{stats.duplicates}</p>
                </div>
              </div>
            </Card>
            <Card>
              <div className="flex items-center gap-3">
                <CircleDollarSign className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Allocated Today</p>
                  <p className="text-2xl font-semibold">{stats.today}</p>
                </div>
              </div>
            </Card>
          </div>
        </Section>

        <Section title="Imported Transactions" description="Review imported payments and reconcile them to invoices.">
          <div className="mb-4 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full border-0 bg-transparent outline-none"
              placeholder="Search narration, reference or phone number"
            />
          </div>
          {loading ? (
            <Loading title="Loading reconciliation ledger" description="Preparing imported transactions..." />
          ) : filteredTransactions.length === 0 ? (
            <EmptyState title="No imports yet" description="Upload a statement to start the reconciliation workflow." />
          ) : (
            <ImportedTransactionsTable transactions={filteredTransactions} />
          )}
        </Section>

        <Section title="Review Queue" description="Match transactions that require manual review.">
          <ReviewQueue transactions={transactions.filter((item) => item.status === "Needs Review" || item.status === "Imported")} />
        </Section>

        {modalOpen && <ImportStatementModal onClose={() => setModalOpen(false)} onImport={handleImport} />}
      </PageContainer>
    </AppShell>
  );
}
