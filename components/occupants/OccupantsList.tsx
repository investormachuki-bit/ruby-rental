"use client";

import OccupantCard from "./OccupantCard";

type Occupant = {
  id: string;
  occupant_code: string;
  full_name: string;
  phone: string;
  property_name?: string | null;
  unit_number?: string | null;
  move_in_date?: string | null;
  status: string;
  monthly_rent?: number;
};

type Props = {
  occupants: Occupant[];
};

export default function OccupantsList({
  occupants,
}: Props) {

  return (

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

      {occupants.map((occupant) => (

        <OccupantCard
          key={occupant.id}
          occupant={occupant}
        />

      ))}

    </div>

  );

}
