"use client";

import { useState } from "react";

import { uploadWorkspaceAsset } from "@/services/storage";
import { updateWorkspaceSettings } from "@/services/workspace";
import { WorkspaceSettings } from "@/types/workspace";

export function useWorkspaceAssets(
  settings: WorkspaceSettings | null,
  setSettings: (settings: WorkspaceSettings) => void
) {
  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function uploadAsset(
    field: keyof WorkspaceSettings,
    fileName: string,
    file: File
  ) {
    if (!settings) {
      const message =
        "Workspace settings are not loaded.";

      setError(message);
      throw new Error(message);
    }

    setUploading(true);
    setError(null);

    try {
      const url =
        await uploadWorkspaceAsset(
          settings.workspace_id,
          file,
          fileName
        );

      const updatedSettings = {
        ...settings,
        [field]: url,
      } as WorkspaceSettings;

      const saved =
        await updateWorkspaceSettings(
          updatedSettings
        );

      setSettings(saved);
    } catch (error: unknown) {
      console.error(
        "Workspace asset upload failed:",
        error
      );

      let message =
        "Logo upload failed. Please try again.";

      if (error instanceof Error) {
        message = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        message = String(
          (error as { message?: unknown })
            .message
        );
      }

      setError(message);

      throw error;
    } finally {
      setUploading(false);
    }
  }

  async function removeAsset(
    field: keyof WorkspaceSettings
  ) {
    if (!settings) {
      const message =
        "Workspace settings are not loaded.";

      setError(message);
      throw new Error(message);
    }

    setError(null);

    try {
      const updatedSettings = {
        ...settings,
        [field]: null,
      } as WorkspaceSettings;

      const saved =
        await updateWorkspaceSettings(
          updatedSettings
        );

      setSettings(saved);
    } catch (error: unknown) {
      console.error(
        "Workspace asset removal failed:",
        error
      );

      let message =
        "Unable to remove the file.";

      if (error instanceof Error) {
        message = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        message = String(
          (error as { message?: unknown })
            .message
        );
      }

      setError(message);

      throw error;
    }
  }

  return {
    uploading,
    error,
    uploadAsset,
    removeAsset,
  };
}