import { supabase } from "@/lib/supabase";

export type LeaseActivity = {
  id: string;

  date: string;

  title: string;

  description: string;

  type:
    | "lease"
    | "invoice"
    | "payment";
};

export async function getLeaseActivity(
  leaseId: string
): Promise<LeaseActivity[]> {

  const [
    leaseResult,
    invoicesResult,
    paymentsResult,
  ] = await Promise.all([

    supabase
      .from("leases")
      .select(`
        id,
        created_at,
        updated_at,
        status,
        lease_number
      `)
      .eq("id", leaseId)
      .single(),

    supabase
      .from("invoices")
      .select(`
        id,
        created_at,
        invoice_number,
        amount
      `)
      .eq("lease_id", leaseId),

    supabase
      .from("payments")
      .select(`
        id,
        payment_date,
        receipt_number,
        amount
      `)
      .eq("lease_id", leaseId),

  ]);

  if (leaseResult.error) {
    throw leaseResult.error;
  }

  if (invoicesResult.error) {
    throw invoicesResult.error;
  }

  if (paymentsResult.error) {
    throw paymentsResult.error;
  }

  const activity: LeaseActivity[] = [];

  const lease = leaseResult.data;

  activity.push({
    id: `${lease.id}-created`,
    date: lease.created_at,
    title: "Lease Created",
    description: `Lease ${lease.lease_number} was created.`,
    type: "lease",
  });

  if (
    lease.updated_at &&
    lease.updated_at !== lease.created_at
  ) {
    activity.push({
      id: `${lease.id}-updated`,
      date: lease.updated_at,
      title: "Lease Updated",
      description: `Lease status changed to ${lease.status}.`,
      type: "lease",
    });
  }

  (invoicesResult.data ?? []).forEach(
    (invoice) => {

      activity.push({

        id: invoice.id,

        date: invoice.created_at,

        title: "Invoice Created",

        description: `${invoice.invoice_number} • KSh ${Number(invoice.amount).toLocaleString()}`,

        type: "invoice",

      });

    }
  );

  (paymentsResult.data ?? []).forEach(
    (payment) => {

      activity.push({

        id: payment.id,

        date: payment.payment_date,

        title: "Payment Received",

        description: `${payment.receipt_number} • KSh ${Number(payment.amount).toLocaleString()}`,

        type: "payment",

      });

    }
  );

  activity.sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );

  return activity;
}
