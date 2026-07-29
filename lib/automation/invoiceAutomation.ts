import { registerJob } from "./automationEngine";

export function registerInvoiceAutomation() {

  registerJob({

    id: "invoice-generation",

    name: "Generate Monthly Rent Invoices",

    async execute() {

      console.log(
        "Generating monthly rent invoices..."
      );

      // Generate invoices

      // Attach recurring utilities

      // Calculate balances

      // Queue notifications

    },

  });

}
