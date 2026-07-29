import { supabase } from "@/lib/supabase";

export async function uploadWorkspaceAsset(
  workspaceId: string,
  file: File,
  fileName: string
): Promise<string> {

  const extension =
    file.name.split(".").pop();

  const path =
    `${workspaceId}/${fileName}.${extension}`;

  const { error } = await supabase.storage
    .from("workspace-assets")
    .upload(path, file, {
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("workspace-assets")
    .getPublicUrl(path);

  return publicUrl;
}

export async function deleteWorkspaceAsset(
  workspaceId: string,
  fileName: string,
  extension: string
) {
  const { error } = await supabase.storage
    .from("workspace-assets")
    .remove([
      `${workspaceId}/${fileName}.${extension}`,
    ]);

  if (error) {
    throw error;
  }
}

export function getWorkspaceAssetUrl(
  workspaceId: string,
  fileName: string,
  extension: string
) {
  const {
    data: { publicUrl },
  } = supabase.storage
    .from("workspace-assets")
    .getPublicUrl(
      `${workspaceId}/${fileName}.${extension}`
    );

  return publicUrl;
}
