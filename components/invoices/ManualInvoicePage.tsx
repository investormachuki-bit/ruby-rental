"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Section from "@/components/ui/Section";

import { getProperties } from "@/services/properties/getProperties";
import { getUnits } from "@/services/units/getUnits";
import { getActiveLeases } from "@/services/leases/getActiveLeases";

type Property = {
  id: string;
  name: string;
};

type Unit = {
  id: string;
  property_id: string;
  unit_number: string;
};

type Lease = {
  id: string;
  lease_number: string;
  property_id: string;
  unit_id: string;

  tenant?: {
    full_name?: string;
    first_name?: string;
    last_name?: string;
  }[];
};

export default function ManualInvoicePage() {
  const router = useRouter();

  const [properties, setProperties] =
    useState<Property[]>([]);

  const [units, setUnits] =
    useState<Unit[]>([]);

  const [leases, setLeases] =
    useState<Lease[]>([]);

  const [propertyId, setPropertyId] =
    useState("");

  const [unitId, setUnitId] =
    useState("");

  const [leaseId, setLeaseId] =
    useState("");

  const [tenantName, setTenantName] =
    useState("");

  useEffect(() => {
    async function load() {
      const [
        propertyData,
        unitData,
        leaseData,
      ] = await Promise.all([
        getProperties(),
        getUnits(),
        getActiveLeases(),
      ]);

      setProperties(propertyData);
      setUnits(unitData);
      setLeases(leaseData);
    }

    load();
  }, []);

  const filteredUnits =
    useMemo(
      () =>
        units.filter(
          (u) =>
            u.property_id === propertyId
        ),
      [units, propertyId]
    );

  useEffect(() => {
    const lease = leases.find(
      (l) => l.unit_id === unitId
    );

    if (!lease) {
      setLeaseId("");
      setTenantName("");
      return;
    }

    setLeaseId(lease.id);

    const tenant =
      lease.tenant?.[0];

    setTenantName(
      tenant?.full_name ??
        `${tenant?.first_name ?? ""} ${tenant?.last_name ?? ""}`.trim()
    );
  }, [unitId, leases]);

  return (
    <Section>
      <Card>

        <div className="grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Property
            </label>

            <select
              className="w-full rounded-lg border p-3"
              value={propertyId}
              onChange={(e) => {
                setPropertyId(
                  e.target.value
                );
                setUnitId("");
              }}
            >
              <option value="">
                Select Property
              </option>

              {properties.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                >
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Unit
            </label>

            <select
              className="w-full rounded-lg border p-3"
              value={unitId}
              onChange={(e) =>
                setUnitId(
                  e.target.value
                )
              }
            >
              <option value="">
                Select Unit
              </option>

              {filteredUnits.map(
                (unit) => (
                  <option
                    key={unit.id}
                    value={unit.id}
                  >
                    {unit.unit_number}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Tenant
            </label>

            <input
              readOnly
              value={tenantName}
              className="w-full rounded-lg border bg-gray-100 p-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Active Lease
            </label>

            <input
              readOnly
              value={leaseId}
              className="w-full rounded-lg border bg-gray-100 p-3"
            />
          </div>

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <Button
            variant="secondary"
            onClick={() =>
              router.back()
            }
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            disabled={!leaseId}
            onClick={() =>
              router.push(
                `/invoices/${leaseId}`
              )
            }
          >
            Preview Invoice
          </Button>

        </div>

      </Card>
    </Section>
  );
}
