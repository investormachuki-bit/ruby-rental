"use client";

import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const sections = [
  {
    title: "Record Expense",
    description: "Capture a new operational expense.",
  },
  {
    title: "Recurring Expenses",
    description: "Manage monthly recurring expenses.",
  },
  {
    title: "Expense Categories",
    description: "Organize expenses by category.",
  },
  {
    title: "Suppliers",
    description: "Manage vendors and service providers.",
  },
  {
    title: "Receipts",
    description: "Attach invoices and receipts.",
  },
  {
    title: "Expense Reports",
    description: "Analyze operational spending.",
  },
];

export default function ExpensesDashboard() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {sections.map((section) => (
        <Card key={section.title}>
          <h2 className="text-xl font-semibold">
            {section.title}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {section.description}
          </p>

          <Button className="mt-6">
            Open
          </Button>
        </Card>
      ))}
    </div>
  );
}
