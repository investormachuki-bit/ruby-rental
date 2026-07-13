import AppShell from "@/components/layout/AppShell";
import LeaseDetailsPage from "@/components/leases/LeaseDetailsPage";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({
  params,
}: Props) {
  const { id } = await params;

  return (
    <AppShell>
      <LeaseDetailsPage leaseId={id} />
    </AppShell>
  );
}
