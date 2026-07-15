"use client";

import { useEffect, useState } from "react";

import Select from "./Select";

import {
  getPropertiesForSelect,
  SelectOption as PropertyOption,
} from "@/services/properties/getPropertiesForSelect";

import {
  getUnitsForSelect,
  SelectOption as UnitOption,
} from "@/services/units/getUnitsForSelect";

type Props = {
  propertyId: string | null;

  unitId: string | null;

  onPropertyChange: (value: string | null) => void;

  onUnitChange: (value: string | null) => void;

  disabled?: boolean;
};

export default function PropertyUnitSelector({
  propertyId,
  unitId,
  onPropertyChange,
  onUnitChange,
  disabled = false,
}: Props) {

  const [properties, setProperties] =
    useState<PropertyOption[]>([]);

  const [units, setUnits] =
    useState<UnitOption[]>([]);

  const [loadingProperties, setLoadingProperties] =
    useState(true);

  const [loadingUnits, setLoadingUnits] =
    useState(false);

  useEffect(() => {

    async function loadProperties() {

      try {

        setLoadingProperties(true);

        const data =
          await getPropertiesForSelect();

        setProperties(data);

      } finally {

        setLoadingProperties(false);

      }

    }

    loadProperties();

  }, []);

  useEffect(() => {

    async function loadUnits() {

      if (!propertyId) {

        setUnits([]);

        return;

      }

      try {

        setLoadingUnits(true);

        const data =
          await getUnitsForSelect(propertyId);

        setUnits(data);

      } finally {

        setLoadingUnits(false);

      }

    }

    loadUnits();

  }, [propertyId]);

  return (

    <div className="grid gap-4 md:grid-cols-2">

      <Select
        label="Property"
        value={propertyId ?? ""}
        disabled={
          disabled ||
          loadingProperties
        }
        options={properties}
        onChange={(e) => {

          const value =
            e.target.value || null;

          onPropertyChange(value);

          onUnitChange(null);

        }}
      />

      <Select
        label="Unit"
        value={unitId ?? ""}
        disabled={
          disabled ||
          !propertyId ||
          loadingUnits
        }
        options={units}
        onChange={(e) => {

          onUnitChange(
            e.target.value || null
          );

        }}
      />

    </div>

  );

}
