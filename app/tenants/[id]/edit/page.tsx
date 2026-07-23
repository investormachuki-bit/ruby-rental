import TenantEditPage from "@/components/tenants/TenantEditPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <TenantEditPage tenantId={id} />;
}
