import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export async function getAllPayments() {

  const {
    data: { session },
  } =
    await supabase.auth.getSession();

  if (!session) {

    throw new Error(
      "You are not logged in."
    );

  }

  const profile =
    await getProfile(
      session.user.id
    );

  if (!profile) {

    throw new Error(
      "Profile not found."
    );

  }

  const {
    data,
    error,
  } = await supabase
    .from("payments")
    .select("*")
    .eq(
      "workspace_id",
      profile.workspace_id
    )
    .eq(
      "is_reversed",
      false
    )
    .order(
      "payment_date",
      {
        ascending: false,
      }
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error) {

    throw error;

  }

  return data ?? [];

}
