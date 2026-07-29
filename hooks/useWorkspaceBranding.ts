"use client";

import { useEffect, useState } from "react";

import { getWorkspaceSettings } from "@/services/workspace";
import { WorkspaceSettings } from "@/types/workspace";

export function useWorkspaceBranding() {

  const [branding, setBranding] =
    useState<WorkspaceSettings | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function load() {

      try {

        const data =
          await getWorkspaceSettings();

        setBranding(data);

      } finally {

        setLoading(false);

      }

    }

    load();

  }, []);

  return {
    branding,
    loading,
  };

}
