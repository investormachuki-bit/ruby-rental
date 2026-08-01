import { supabase } from "@/lib/supabase";

import { getProfile } from "@/services/auth/getProfile";

import type { BillingSettings } from "./types";

export async function getBillingSettings(): Promise<BillingSettings | null> {

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("You are not logged in.");
  }

  const profile = await getProfile(session.user.id);

  if (!profile) {
    throw new Error("Profile not found.");
  }

  const { data, error } = await supabase
    .from("billing_settings")
    .select("*")
    .eq("workspace_id", profile.workspace_id)
    .single();

  if (error) {
    throw error;
  }

  return data as BillingSettings;

}
