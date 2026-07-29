import { supabase } from "@/lib/supabase";
import { getProfile } from "@/services/auth/getProfile";

export async function logAudit(
  module: string,
  action: string,
  entity: string,
  entityId: string | null,
  description: string,
  oldValues?: unknown,
  newValues?: unknown
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return;

  const profile = await getProfile(session.user.id);

  if (!profile) return;

  await supabase.from("audit_logs").insert({

    workspace_id: profile.workspace_id,

    user_id: session.user.id,

    module,

    action,

    entity,

    entity_id: entityId,

    description,

    old_values: oldValues,

    new_values: newValues,

    user_agent:
      navigator.userAgent,

  });

}
