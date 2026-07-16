"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import AppShell from "@/components/layout/AppShell";

import Breadcrumb from "@/components/common/Breadcrumb";

import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Card from "@/components/ui/Card";
import Loading from "@/components/ui/Loading";

import UnitForm from "@/components/units/UnitForm";

import { getUnit } from "@/services/units/getUnit";

export default function EditUnitPage() {

  const params = useParams();

  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [unit, setUnit] =
    useState<any>(null);

  useEffect(() => {

    loadUnit();

  }, []);

  async function loadUnit() {

    try {

      setLoading(true);

      const data =
        await getUnit(
          params.id as string
        );

      setUnit(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (

      <AppShell>

        <Loading
          title="Loading Unit"
          description="Preparing unit information..."
        />

      </AppShell>

    );

  }

  if (!unit) {

    return (

      <AppShell>

        <div className="p-8">

          Unit not found.

        </div>

      </AppShell>

    );

  }

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
              label: unit.unit_number,
              href: `/units/${unit.id}`,
            },
            {
              label: "Edit",
            },
          ]}
        />

        <PageHeader
          title={`Edit ${unit.unit_number}`}
          description="Update unit information."
        />

        <Card>

          <UnitForm

            unit={unit}

            onSuccess={() => {

              router.push(
                `/units/${unit.id}`
              );

              router.refresh();

            }}

            onCancel={() => {

              router.back();

            }}

          />

        </Card>

      </PageContainer>

    </AppShell>

  );

}
