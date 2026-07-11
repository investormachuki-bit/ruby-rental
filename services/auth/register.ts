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
  // STEP 1: Create authentication user
  const { data: authData, error: authError } =
    await supabase.auth.signUp({
      email,
      password,
    });

  if (authError) {
    throw new Error("AUTH: " + authError.message);
  }

  const user = authData.user;

  if (!user) {
    throw new Error("AUTH: User was not created.");
  }

  // STEP 2: Create workspace
  const { data: workspace, error: workspaceError } =
    await supabase
      .from("workspaces")
      .insert({
        name: businessName,
        brand_name: businessName,
        phone,
        email,
      })
      .select()
      .single();

  if (workspaceError) {
    throw new Error("WORKSPACE: " + workspaceError.message);
  }

  if (!workspace) {
    throw new Error("WORKSPACE: Workspace was not created.");
  }

  // STEP 3: Create profile
  const { error: profileError } =
    await supabase
      .from("profiles")
      .insert({
        id: user.id,
        workspace_id: workspace.id,
        full_name: fullName,
        phone,
        role: "Owner",
        is_active: true,
      });

  if (profileError) {
    throw new Error("PROFILE: " + profileError.message);
  }

  return user;
}
