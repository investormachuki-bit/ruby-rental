import { supabase } from "@/lib/supabase";

import { getProfile } from "@/services/auth/getProfile";

export async function updateWorkspaceModule(

  moduleId: string,

  enabled: boolean

) {

  const {

    data: { session },

  } = await supabase.auth.getSession();

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

  const { data: module, error: moduleError } =
    await supabase
      .from("available_modules")
      .select("is_core")
      .eq("id", moduleId)
      .single();

  if (moduleError) {

    throw moduleError;

  }

  if (module.is_core && !enabled) {

    throw new Error(
      "Core modules cannot be disabled."
    );

  }

  const { error } =
    await supabase
      .from("workspace_modules")
      .update({
        enabled,
      })
      .eq(
        "workspace_id",
        profile.workspace_id
      )
      .eq(
        "module_id",
        moduleId
      );

  if (error) {

    throw error;

  }

}
