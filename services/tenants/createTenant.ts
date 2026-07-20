import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";
import { TABLES } from "@/constants/tables";

export type CreateTenantInput = {
  fullName: string;
  phone: string;

  email?: string;
  idNumber?: string;

  emergencyContactName?: string;
  emergencyContactPhone?: string;

  occupation?: string;
  employer?: string;

  notes?: string;
};

export async function createTenant(
  input: CreateTenantInput
) {
  // Get logged in user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  // Get profile
  const profile = await getProfile(session.user.id);

  if (!profile) {
    throw new Error("Profile not found.");
  }

  // Generate Tenant Code
  const {
    data: tenantCode,
    error: codeError,
  } = await supabase.rpc("generate_tenant_code", {
    p_workspace_id: profile.workspace_id,
  });

  if (codeError) {
    throw codeError;
  }

  // Split full name
  const parts = input.fullName.trim().split(/\s+/);

  const firstName = parts.shift() ?? "";
  const lastName = parts.join(" ");

  // Create Tenant
  const { data, error } = await supabase
    .from(TABLES.TENANTS)
    .insert({
      workspace_id: profile.workspace_id,

      tenant_code: tenantCode,

      full_name: input.fullName.trim(),

      first_name: firstName,
      last_name: lastName,

      phone: input.phone.trim(),

      email: input.email?.trim() || null,

      id_number: input.idNumber?.trim() || null,

      emergency_contact_name:
        input.emergencyContactName?.trim() || null,

      emergency_contact_phone:
        input.emergencyContactPhone?.trim() || null,

      occupation:
        input.occupation?.trim() || null,

      employer:
        input.employer?.trim() || null,

      status: "Prospective",

      notes:
        input.notes?.trim() || null,

      is_primary: true,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}
