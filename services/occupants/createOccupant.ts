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
  // Get logged in user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  // Get profile
  const profile = await getProfile(
    session.user.id
  );

  if (!profile) {
    throw new Error("Profile not found.");
  }

  // Generate Occupant Code
  const {
    data: occupantCode,
    error: codeError,
  } = await supabase.rpc(
    "generate_occupant_code",
    {
      p_workspace_id:
        profile.workspace_id,
    }
  );

  if (codeError) {
    throw codeError;
  }

  // Split full name into first & last
  const parts = input.fullName
    .trim()
    .split(/\s+/);

  const firstName =
    parts.shift() ?? "";

  const lastName =
    parts.join(" ");

  // Create occupant
  const { data, error } =
    await supabase
      .from("occupants")
      .insert({
        workspace_id:
          profile.workspace_id,

        property_id:
          input.propertyId,

        unit_id:
          input.unitId ?? null,

        occupant_code:
          occupantCode,

        // New schema
        full_name:
          input.fullName.trim(),

        phone:
          input.phone.trim(),

        // Legacy compatibility
        first_name:
          firstName,

        last_name:
          lastName,

        phone_number:
          input.phone.trim(),

        email:
          input.email?.trim() || null,

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

  // Mark unit occupied
  if (input.unitId) {
    const { error: unitError } =
      await supabase
        .from("units")
        .update({
          status: "Occupied",
        })
        .eq("id", input.unitId);

    if (unitError) {
      throw unitError;
    }
  }

  return data;
}
