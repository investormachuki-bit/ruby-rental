import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export type CreateOccupantInput = {
  propertyId: string;
  unitId?: string | null;

  fullName: string;
  phone: string;

  email?: string;
  idNumber?: string;

  emergencyContactName?: string;
  emergencyContactPhone?: string;

  occupation?: string;
  employer?: string;

  moveInDate?: string;

  notes?: string;
};

export async function createOccupant(
  input: CreateOccupantInput
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  const profile = await getProfile(
    session.user.id
  );

  if (!profile) {
    throw new Error("Profile not found.");
  }

  // Generate next occupant code
  const { count } = await supabase
    .from("occupants")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq(
      "workspace_id",
      profile.workspace_id
    );

  const occupantCode = `TEN-${String(
    (count ?? 0) + 1
  ).padStart(6, "0")}`;

  const { data, error } = await supabase
    .from("occupants")
    .insert({
      workspace_id: profile.workspace_id,

      property_id: input.propertyId,

      unit_id: input.unitId ?? null,

      occupant_code: occupantCode,

      full_name: input.fullName.trim(),

      phone: input.phone.trim(),

      email: input.email?.trim() || null,

      id_number:
        input.idNumber?.trim() || null,

      emergency_contact_name:
        input.emergencyContactName?.trim() ||
        null,

      emergency_contact_phone:
        input.emergencyContactPhone?.trim() ||
        null,

      occupation:
        input.occupation?.trim() || null,

      employer:
        input.employer?.trim() || null,

      move_in_date:
        input.moveInDate || null,

      notes:
        input.notes?.trim() || null,

      is_primary: true,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  // If assigned to a unit,
  // automatically mark the unit occupied.

  if (input.unitId) {
    await supabase
      .from("units")
      .update({
        status: "Occupied",
      })
      .eq("id", input.unitId);
  }

  return data;
}
