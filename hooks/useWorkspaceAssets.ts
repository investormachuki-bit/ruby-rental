"use client";

import { useState } from "react";

import { uploadWorkspaceAsset } from "@/services/storage";
import { updateWorkspaceSettings } from "@/services/workspace";
import { WorkspaceSettings } from "@/types/workspace";

export function useWorkspaceAssets(
  settings: WorkspaceSettings,
  setSettings: (settings: WorkspaceSettings) => void
) {
  const [uploading, setUploading] = useState(false);

  async function uploadAsset(
    field: keyof WorkspaceSettings,
    fileName: string,
    file: File
  ) {
    setUploading(true);

    try {
      const url = await uploadWorkspaceAsset(
        settings.workspace_id,
        file,
        fileName
      );

      const updatedSettings = {
        ...settings,
        [field]: url,
      } as WorkspaceSettings;

      const saved =
        await updateWorkspaceSettings(updatedSettings);

      setSettings(saved);
    } finally {
      setUploading(false);
    }
  }

  async function removeAsset(
    field: keyof WorkspaceSettings
  ) {
    const updatedSettings = {
      ...settings,
      [field]: null,
    } as WorkspaceSettings;

    const saved =
      await updateWorkspaceSettings(updatedSettings);

    setSettings(saved);
  }

  return {
    uploading,
    uploadAsset,
    removeAsset,
  };
}
