import { supabase } from "@/lib/supabase";

type RegisterData = {
  businessName: string;
  fullName: string;
  phone: string;
  email: string;
  password: string;
};

export async function register({
  businessName,
  fullName,
  phone,
  email,
  password,
}: RegisterData) {
  // Create authentication user
  const { data: authData, error: authError } =
    await supabase.auth.signUp({
      email,
      password,
    });

  if (authError) {
    throw authError;
  }

  const user = authData.user;

  if (!user) {
    throw new Error("User was not created.");
  }

  // Create organization
  const { data: organization, error: organizationError } =
    await supabase
      .from("organizations")
      .insert({
        name: businessName,
        brand_name: businessName,
        phone,
        email,
      })
      .select()
      .single();

  if (organizationError) {
    throw organizationError;
  }

  // Create profile
  const { error: profileError } =
    await supabase.from("profiles").insert({
      id: user.id,
      organization_id: organization.id,
      full_name: fullName,
      phone,
      role: "Owner",
    });

  if (profileError) {
    throw profileError;
  }

  return user;
}
