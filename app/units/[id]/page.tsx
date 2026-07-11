import UnitDetailsPage from "@/components/units/UnitDetailsPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <UnitDetailsPage unitId={id} />
  );
}
