import { supabase } from "@/lib/supabase";

import { getProfile } from "@/services/auth/getProfile";

export type WorkspaceModule = {

  id: string;

  enabled: boolean;

  module_id: string;

  available_modules: {

    id: string;

    module_key: string;

    name: string;

    description: string | null;

    icon: string | null;

    category: string;

    route: string;

    sort_order: number;

    is_core: boolean;

  };

};

export async function getWorkspaceModules() {

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

  const {

    data,

    error,

  } = await supabase

    .from("workspace_modules")

    .select(`

      id,

      enabled,

      module_id,

      available_modules (

        id,

        module_key,

        name,

        description,

        icon,

        category,

        route,

        sort_order,

        is_core

      )

    `)

    .eq(

      "workspace_id",

      profile.workspace_id

    )

    .order(

      "module_id"

    );

  if (error) {

    throw error;

  }

  return data as WorkspaceModule[];

}
