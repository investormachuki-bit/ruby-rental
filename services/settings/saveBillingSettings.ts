import { supabase } from "@/lib/supabase";

import { getProfile } from "@/services/auth/getProfile";

import type { BillingSettings } from "./types";

export async function saveBillingSettings(
  settings: Omit<BillingSettings, "workspace_id">
): Promise<void> {

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

  const { error } = await supabase
    .from("billing_settings")
    .upsert({
      workspace_id: profile.workspace_id,
      ...settings,
    });

  if (error) {
    throw error;
  }

}
