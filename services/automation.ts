import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export type AutomationSettings = {
  id: string;
  workspace_id: string;

  invoice_generation_enabled: boolean;
  invoice_generation_days_before: number;

  recurring_charges_enabled: boolean;

  rent_reminders_enabled: boolean;
  first_reminder_days_before: number;
  overdue_reminder_frequency: number;

  late_fees_enabled: boolean;
  late_fee_days: number;

  lease_reminders_enabled: boolean;
  lease_reminder_days: number;

  maintenance_followup_enabled: boolean;
  maintenance_followup_days: number;

  owner_statement_enabled: boolean;
  owner_statement_day: number;
};

async function getWorkspaceId() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Not authenticated.");
  }

  const profile = await getProfile(session.user.id);

  if (!profile) {
    throw new Error("Profile not found.");
  }

  return profile.workspace_id;
}

export async function getAutomationSettings(): Promise<AutomationSettings> {
  const workspaceId = await getWorkspaceId();

  const { data, error } = await supabase
    .from("automation_settings")
    .select("*")
    .eq("workspace_id", workspaceId)
    .single();

  if (error) throw error;

  return data;
}

export async function createDefaultAutomationSettings() {
  const workspaceId = await getWorkspaceId();

  const { data, error } = await supabase
    .from("automation_settings")
    .insert({
      workspace_id: workspaceId,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateAutomationSettings(
  values: Partial<AutomationSettings>
) {
  const workspaceId = await getWorkspaceId();

  const { data, error } = await supabase
    .from("automation_settings")
    .update(values)
    .eq("workspace_id", workspaceId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getOrCreateAutomationSettings() {
  try {
    return await getAutomationSettings();
  } catch {
    return await createDefaultAutomationSettings();
  }
}
