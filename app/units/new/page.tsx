"use client";

import { useRouter } from "next/navigation";

import AppShell from "@/components/layout/AppShell";

import Breadcrumb from "@/components/common/Breadcrumb";

import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";

import UnitForm from "@/components/units/UnitForm";

export default function NewUnitPage() {

  const router = useRouter();

  return (

    <AppShell>

      <PageContainer>

        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              href: "/",
            },
            {
              label: "Units",
              href: "/units",
            },
            {
              label: "New Unit",
            },
          ]}
        />

        <PageHeader
          title="Add New Unit"
          description="Create a new rental unit."
        />

        <Card>

          <UnitForm

            onSuccess={() => {

              router.push("/units");

              router.refresh();

            }}

            onCancel={() => {

              router.push("/units");

            }}

          />

        </Card>

      </PageContainer>

    </AppShell>

  );

}
