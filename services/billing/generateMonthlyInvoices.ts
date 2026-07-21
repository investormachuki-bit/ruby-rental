import { getActiveLeases } from "@/services/leases/getActiveLeases";

import { buildInvoice } from "./buildInvoice";

import { createInvoice } from "@/services/invoices/createInvoice";
import { createInvoiceItem } from "@/services/invoiceItems/createInvoiceItem";

export async function generateMonthlyInvoices() {

  const leases =
    await getActiveLeases();

  const results = {

    processed: 0,

    created: 0,

    skipped: 0,

    failed: 0,

    errors: [] as string[],

  };

  for (const lease of leases) {

    results.processed++;

    try {

      const invoiceData =
        await buildInvoice(
          lease.id
        );
            /*
       * Future enhancement:
       *
       * Before creating an invoice,
       * check whether one already exists
       * for this lease and billing period.
       *
       * If it exists:
       *
       * results.skipped++;
       * continue;
       */

      const invoice =
        await createInvoice({

          lease_id:
            lease.id,

          property_id:
            lease.property_id,

          unit_id:
            lease.unit_id,

          tenant_id:
            lease.tenant_id,

          invoice_type:
            "Rent",

          billing_period:
            invoiceData.billing_period,

          invoice_date:
            new Date(),

          due_date:
            new Date(),

          notes:
            "Monthly auto-generated invoice",

        });
            for (const item of invoiceData.items) {

        await createInvoiceItem({

          invoice_id:
            invoice.id,

          item_type:
            item.item_type,

          description:
            item.description,

          quantity:
            item.quantity,

          unit_price:
            item.unit_price,

        });

      }

      results.created++;

    } catch (error) {

      console.error(error);

      results.failed++;

      results.errors.push(

        `Lease ${lease.id}`

      );

    }

  }

  return results;

}
