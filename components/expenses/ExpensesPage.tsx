"use client";

import AppShell from "@/components/layout/AppShell";

import ExpensesContent from "./content/ExpensesContent";

export default function ExpensesPage() {
  return (
    <AppShell>
      <ExpensesContent />
    </AppShell>
  );
}
