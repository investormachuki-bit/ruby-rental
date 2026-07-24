"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import RecurringChargeFilters from "@/components/recurringCharges/RecurringChargeFilters";
import RecurringChargeTable from "@/components/recurringCharges/RecurringChargeTable";

import { getRecurringCharges } from "@/services/recurringCharges/getRecurringCharges";
import { getPropertyOptions } from "@/services/properties/getPropertyOptions";

import { RecurringCharge } from "@/types/recurringCharge";

type FilterValues = {
  search: string;
  propertyId: string;
  frequency: string;
  status: string;
};

type PropertyOption = {
  id: string;
  name: string;
};

export default function RecurringChargesPage() {
  const [loading, setLoading] = useState(true);

  const [charges, setCharges] = useState<RecurringCharge[]>([]);

  const [properties, setProperties] = useState<PropertyOption[]>([]);

  const [filters, setFilters] = useState<FilterValues>({
    search: "",
    propertyId: "",
    frequency: "",
    status: "",
  });

  async function loadData() {
    try {
      setLoading(true);

      const [chargeData, propertyData] =
        await Promise.all([
          getRecurringCharges(),
          getPropertyOptions(),
        ]);

      setCharges(chargeData);
      setProperties(propertyData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredCharges = useMemo(() => {
    return charges.filter((charge) => {
      if (
        filters.search &&
        !charge.charge_name
          .toLowerCase()
          .includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      if (
        filters.propertyId &&
        charge.property_id !== filters.propertyId
      ) {
        return false;
      }

      if (
        filters.frequency &&
        charge.billing_frequency !== filters.frequency
      ) {
        return false;
      }

      if (
        filters.status === "active" &&
        !charge.is_active
      ) {
        return false;
      }

      if (
        filters.status === "inactive" &&
        charge.is_active
      ) {
        return false;
      }

      return true;
    });
  }, [charges, filters]);

  const activeCharges = filteredCharges.filter(
    (charge) => charge.is_active
  );

  const mandatoryCharges = filteredCharges.filter(
    (charge) => charge.is_mandatory
  );

  const monthlyValue = activeCharges.reduce(
    (sum, charge) => sum + Number(charge.amount),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Recurring Charges
          </h1>

          <p className="text-gray-500">
            Manage recurring charges billed to tenants.
          </p>
        </div>

        <Link
          href="/recurring-charges/new"
          className="rounded-lg bg-black px-5 py-3 font-medium text-white"
        >
          + New Charge
        </Link>
      </div>

      <RecurringChargeFilters
        values={filters}
        properties={properties}
        onChange={setFilters}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Total Charges
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {filteredCharges.length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Active Charges
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {activeCharges.length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Mandatory
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {mandatoryCharges.length}
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">
            Total Active Value
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            KES {monthlyValue.toLocaleString()}
          </h2>
        </div>
      </div>

      <RecurringChargeTable
        loading={loading}
        charges={filteredCharges}
      />
    </div>
  );
}
