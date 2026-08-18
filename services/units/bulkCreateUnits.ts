
import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";
import { createDefaultUtilityMeters } from "@/services/utilities/createDefaultUtilityMeters";

export type BulkUnitInput = {
  propertyId: string;
  prefix: string;
  floorNumber?: number;
  unitType?: string | null;
  bedrooms: number;
  bathrooms: number;
  sizeSqm: number;
  start: number;
  end: number;
  monthlyRent: number;
  deposit: number;
};

export async function bulkCreateUnits(
  input: BulkUnitInput
) {
  /*
   * ============================================================
   * 1. GET LOGGED-IN SESSION
   * ============================================================
   */

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!session) {
    throw new Error(
      "You are not logged in."
    );
  }


  /*
   * ============================================================
   * 2. GET USER PROFILE / WORKSPACE
   * ============================================================
   */

  const profile =
    await getProfile(session.user.id);

  if (!profile) {
    throw new Error(
      "Profile not found."
    );
  }


  /*
   * ============================================================
   * 3. VALIDATE BASIC INPUT
   * ============================================================
   */

  if (!input.propertyId) {
    throw new Error(
      "Please select a property."
    );
  }

  if (!input.prefix?.trim()) {
    throw new Error(
      "Please enter a unit prefix."
    );
  }

  if (
    !Number.isInteger(input.start) ||
    !Number.isInteger(input.end)
  ) {
    throw new Error(
      "Unit numbers must be valid whole numbers."
    );
  }

  if (input.end < input.start) {
    throw new Error(
      "The ending unit number must be greater than or equal to the starting unit number."
    );
  }

  const requestedUnits =
    input.end - input.start + 1;

  if (requestedUnits <= 0) {
    throw new Error(
      "The number of units must be greater than zero."
    );
  }


  /*
   * ============================================================
   * 4. CALL SECURE DATABASE RPC
   *
   * The database is the final authority.
   *
   * This protects against:
   *
   * - frontend bypass
   * - direct API calls
   * - simultaneous requests
   * - bulk-generator manipulation
   * ============================================================
   */

  const {
    data: createdUnits,
    error: createError,
  } = await supabase.rpc(
    "bulk_create_units",
    {
      p_property_id:
        input.propertyId,

      p_prefix:
        input.prefix.trim(),

      p_floor_number:
        input.floorNumber ?? null,

      p_unit_type:
        input.unitType ?? null,

      p_bedrooms:
        input.bedrooms,

      p_bathrooms:
        input.bathrooms,

      p_size_sqm:
        input.sizeSqm,

      p_start:
        input.start,

      p_end:
        input.end,

      p_monthly_rent:
        input.monthlyRent,

      p_deposit:
        input.deposit,
    }
  );

  /*
   * Return the database's entitlement error
   * directly to the UI.
   */

  if (createError) {
    throw new Error(
      createError.message ||
        "Unable to create units."
    );
  }

  if (!createdUnits) {
    throw new Error(
      "No units were created."
    );
  }


  /*
   * ============================================================
   * 5. CREATE DEFAULT UTILITY METERS
   *
   * Preserve the existing Ruby Rental behavior.
   * ============================================================
   */

  for (const unit of createdUnits) {
    await createDefaultUtilityMeters({
      workspace_id:
        profile.workspace_id,

      property_id:
        input.propertyId,

      unit_id:
        unit.id,
    });
  }


  /*
   * ============================================================
   * 6. RETURN CREATED UNITS
   * ============================================================
   */

  return createdUnits;
}