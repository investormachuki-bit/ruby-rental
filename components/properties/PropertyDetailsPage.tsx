"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Building2,
  Home,
  Users,
  FileText,
  CreditCard,
  Receipt,
  Wrench,
} from "lucide-react";

import AppShell from "@/components/layout/AppShell";

import Breadcrumb from "@/components/common/Breadcrumb";

import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import Loading from "@/components/ui/Loading";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

import { Property } from "@/types/property";

import { getPropertyDetails } from "@/services/properties/getPropertyDetails";
import { getPropertyUnitStats } from "@/services/units/getPropertyUnitStats";
import AddUnitModal from "@/components/units/AddUnitModal";
import BulkUnitGenerator from "@/components/units/BulkUnitGenerator";

type Props = {
  propertyId: string;
};

export default function PropertyDetailsPage({
  propertyId,
}: Props) {

  const [property, setProperty] =
    useState<Property | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      totalUnits: 0,
      occupied: 0,
      vacant: 0,
      monthlyIncome: 0,
    });

  const [
  showAddUnit,
  setShowAddUnit,
] = useState(false);

const [
  showBulkGenerator,
  setShowBulkGenerator,
] = useState(false);

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {

    try {

      setLoading(true);

      const [
        propertyData,
        statsData,
      ] = await Promise.all([
        getPropertyDetails(propertyId),
        getPropertyUnitStats(propertyId),
      ]);

      setProperty(propertyData);

      setStats(statsData);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (

      <AppShell>

        <PageContainer>

          <Loading
            title="Loading Property"
            description="Preparing property information..."
          />

        </PageContainer>

      </AppShell>

    );

  }

  if (!property) {

    return (

      <AppShell>

        <PageContainer>

          <Card>

            <div className="py-12 text-center">

              <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-400" />

              <h2 className="text-2xl font-bold">

                Property Not Found

              </h2>

              <p className="mt-2 text-gray-500">

                The requested property could not be found.

              </p>

            </div>

          </Card>

        </PageContainer>

      </AppShell>

    );

  }

  const occupancy =
    stats.totalUnits === 0
      ? 0
      : Math.round(
          (stats.occupied /
            stats.totalUnits) *
            100
        );
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
            label: "Properties",
            href: "/properties",
          },
          {
            label: property.name,
          },
        ]}
      />

      <PageHeader
        title={property.name}
        description="Property Summary"
      >

        <Badge
          variant={
            property.is_active
              ? "success"
              : "danger"
          }
        >
          {property.is_active
            ? "Active"
            : "Archived"}
        </Badge>

      </PageHeader>

      <Section>

        <Card>

          <h2 className="mb-6 text-xl font-bold">

            Property Information

          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <p className="text-sm text-gray-500">

                Property Name

              </p>

              <p className="font-semibold">

                {property.name}

              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">

                Property Type

              </p>

              <p className="font-semibold">

                {property.property_type}

              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">

                County

              </p>

              <p className="font-semibold">

                {property.county || "-"}

              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">

                Town

              </p>

              <p className="font-semibold">

                {property.town || "-"}

              </p>

            </div>

            <div className="md:col-span-2">

              <p className="text-sm text-gray-500">

                Address

              </p>

              <p className="font-semibold">

                {property.address || "-"}

              </p>

            </div>

            <div className="md:col-span-2">

              <p className="text-sm text-gray-500">

                Description

              </p>

              <p className="font-semibold">

                {property.description || "-"}

              </p>

            </div>

          </div>

        </Card>

      </Section>

      <Section>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

          <StatCard
            title="Total Units"
            value={stats.totalUnits}
            subtitle="Registered Units"
            icon={
              <Home className="h-6 w-6 text-[#D4AF37]" />
            }
          />

          <StatCard
            title="Occupied"
            value={stats.occupied}
            subtitle="Currently Occupied"
            icon={
              <Users className="h-6 w-6 text-green-600" />
            }
            valueClassName="text-green-600"
          />

          <StatCard
            title="Vacant"
            value={stats.vacant}
            subtitle="Available Units"
            icon={
              <Home className="h-6 w-6 text-amber-500" />
            }
            valueClassName="text-amber-500"
          />

          <StatCard
            title="Occupancy"
            value={`${occupancy}%`}
            subtitle="Current Occupancy"
            icon={
              <Building2 className="h-6 w-6 text-blue-600" />
            }
            valueClassName="text-blue-600"
          />

        </div>

      </Section>

      <Section>

        <Card>

          <h2 className="mb-6 text-xl font-bold">

            Financial Summary

          </h2>

          <div className="grid gap-6 md:grid-cols-3">

            <div>

              <p className="text-sm text-gray-500">

                Expected Monthly Rent

              </p>

              <p className="text-2xl font-bold text-[#D4AF37]">

                KSh {stats.monthlyIncome.toLocaleString()}

              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">

                Occupancy Rate

              </p>

              <p className="text-2xl font-bold">

                {occupancy}%

              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">

                Total Units

              </p>

              <p className="text-2xl font-bold">

                {stats.totalUnits}

              </p>

            </div>

          </div>

        </Card>

      </Section>
      <Section>

  <Card>

    <h2 className="mb-6 text-xl font-bold">

      Related Modules

    </h2>

    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

      <Link href={`/units?property=${property.id}`}>

  <Card className="cursor-pointer border transition hover:border-[#D4AF37] hover:shadow-lg">

    <Home className="mb-4 h-10 w-10 text-[#D4AF37]" />

    <h3 className="text-lg font-semibold">

      Units

    </h3>

    <p className="mt-2 text-sm text-gray-500">

      Manage all units in this property.

    </p>

    <Button
      className="mt-5 w-full"
      variant="secondary"
    >
      Manage Units
    </Button>

  </Card>

</Link>
<Link href={`/occupants?property=${property.id}`}>

  <Card className="cursor-pointer border transition hover:border-[#D4AF37] hover:shadow-lg">

    <Users className="mb-4 h-10 w-10 text-blue-600" />

    <h3 className="text-lg font-semibold">

      Occupants

    </h3>

    <p className="mt-2 text-sm text-gray-500">

      View occupants living in this property.

    </p>

    <Button
      className="mt-5 w-full"
      variant="secondary"
    >
      View Occupants
    </Button>

  </Card>

</Link>
      <Link href={`/leases?property=${property.id}`}>

  <Card className="cursor-pointer border transition hover:border-[#D4AF37] hover:shadow-lg">

    <FileText className="mb-4 h-10 w-10 text-green-600" />

    <h3 className="text-lg font-semibold">

      Leases

    </h3>

    <p className="mt-2 text-sm text-gray-500">

      Manage active and past lease agreements.

    </p>

    <Button
      className="mt-5 w-full"
      variant="secondary"
    >
      View Leases
    </Button>

  </Card>

</Link>

<Link href={`/payments?property=${property.id}`}>

  <Card className="cursor-pointer border transition hover:border-[#D4AF37] hover:shadow-lg">

    <CreditCard className="mb-4 h-10 w-10 text-purple-600" />

    <h3 className="text-lg font-semibold">

      Payments

    </h3>

    <p className="mt-2 text-sm text-gray-500">

      View rent payment records for this property.

    </p>

    <Button
      className="mt-5 w-full"
      variant="secondary"
    >
      View Payments
    </Button>

  </Card>

</Link>

      <Link href={`/expenses?property=${property.id}`}>

  <Card className="cursor-pointer border transition hover:border-[#D4AF37] hover:shadow-lg">

    <Receipt className="mb-4 h-10 w-10 text-red-600" />

    <h3 className="text-lg font-semibold">

      Expenses

    </h3>

    <p className="mt-2 text-sm text-gray-500">

      Track all expenses for this property.

    </p>

    <Button
      className="mt-5 w-full"
      variant="secondary"
    >
      View Expenses
    </Button>

  </Card>

</Link>

      <Link href={`/maintenance?property=${property.id}`}>

  <Card className="cursor-pointer border transition hover:border-[#D4AF37] hover:shadow-lg">

    <Wrench className="mb-4 h-10 w-10 text-orange-600" />

    <h3 className="text-lg font-semibold">

      Maintenance

    </h3>

    <p className="mt-2 text-sm text-gray-500">

      Manage maintenance requests for this property.

    </p>

    <Button
      className="mt-5 w-full"
      variant="secondary"
    >
      Manage Maintenance
    </Button>

  </Card>

</Link>

    </div>

  </Card>

</Section>
      {showAddUnit && (

  <AddUnitModal

    open={showAddUnit}

    onClose={() =>
      setShowAddUnit(false)
    }

    onSuccess={() => {

  setShowAddUnit(false);

  loadPage();

}}

  />

)}

{showBulkGenerator && (

  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

    <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white">

      <div className="border-b p-6">

        <h2 className="text-3xl font-bold">

          Bulk Unit Generator

        </h2>

      </div>

      <div className="p-6">

        <BulkUnitGenerator

          properties={[property]}

          defaultPropertyId={property.id}

          onCancel={() =>
            setShowBulkGenerator(false)
          }

          onSuccess={() => {

  setShowBulkGenerator(false);

  loadPage();

}}

        />

      </div>

    </div>

  </div>

)}

    </PageContainer>

  </AppShell>

);

}
