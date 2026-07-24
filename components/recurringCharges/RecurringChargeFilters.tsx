"use client";

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

type Props = {
  values: FilterValues;
  properties: PropertyOption[];
  onChange: (values: FilterValues) => void;
};

const FREQUENCIES = [
  "",
  "Monthly",
  "Quarterly",
  "Biannual",
  "Annual",
  "One Time",
];

export default function RecurringChargeFilters({
  values,
  properties,
  onChange,
}: Props) {
  function update<K extends keyof FilterValues>(
    key: K,
    value: FilterValues[K]
  ) {
    onChange({
      ...values,
      [key]: value,
    });
  }

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium">
            Search
          </label>

          <input
            type="text"
            placeholder="Charge name..."
            className="w-full rounded-lg border p-3"
            value={values.search}
            onChange={(e) =>
              update("search", e.target.value)
            }
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Property
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={values.propertyId}
            onChange={(e) =>
              update("propertyId", e.target.value)
            }
          >
            <option value="">
              All Properties
            </option>

            {properties.map((property) => (
              <option
                key={property.id}
                value={property.id}
              >
                {property.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Frequency
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={values.frequency}
            onChange={(e) =>
              update("frequency", e.target.value)
            }
          >
            <option value="">
              All Frequencies
            </option>

            {FREQUENCIES.filter(Boolean).map(
              (frequency) => (
                <option
                  key={frequency}
                  value={frequency}
                >
                  {frequency}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Status
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={values.status}
            onChange={(e) =>
              update("status", e.target.value)
            }
          >
            <option value="">
              All
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>
      </div>
    </div>
  );
}
