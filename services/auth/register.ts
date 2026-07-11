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
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        business_name: businessName,
        full_name: fullName,
        phone,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data.user;
}
