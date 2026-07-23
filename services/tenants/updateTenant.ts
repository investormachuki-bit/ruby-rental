import { supabase } from "@/lib/supabase";

type UpdateTenantInput = {
  tenantId: string;
  fullName: string;
  phone: string;
  email: string;
  idNumber: string;
  occupation: string;
  employer: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  notes: string;
};

export async function updateTenant({
  tenantId,
  fullName,
  phone,
  email,
  idNumber,
  occupation,
  employer,
  emergencyContactName,
  emergencyContactPhone,
  notes,
}: UpdateTenantInput) {

  const names = fullName.trim().split(" ");

  const firstName = names[0] ?? "";

  const lastName =
    names.length > 1
      ? names.slice(1).join(" ")
      : "";

  const { error } = await supabase
    .from("tenants")
    .update({
      full_name: fullName,
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      id_number: idNumber,
      occupation,
      employer,
      emergency_contact_name:
        emergencyContactName,
      emergency_contact_phone:
        emergencyContactPhone,
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", tenantId);

  if (error) throw error;
}
