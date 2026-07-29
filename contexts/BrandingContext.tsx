"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getWorkspaceSettings,
} from "@/services/workspace";

import {
  WorkspaceSettings,
} from "@/types/workspace";

type BrandingContextType = {
  branding: WorkspaceSettings | null;
  loading: boolean;
  refreshBranding: () => Promise<void>;
};

const BrandingContext =
  createContext<BrandingContextType | null>(null);

export function BrandingProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [branding, setBranding] =
    useState<WorkspaceSettings | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function refreshBranding() {

    try {

      const settings =
        await getWorkspaceSettings();

      setBranding(settings);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {
    refreshBranding();
  }, []);

  return (

    <BrandingContext.Provider
      value={{
        branding,
        loading,
        refreshBranding,
      }}
    >

      {children}

    </BrandingContext.Provider>

  );

}

export function useBranding() {

  const context =
    useContext(BrandingContext);

  if (!context) {

    throw new Error(
      "useBranding must be used inside BrandingProvider."
    );

  }

  return context;

}
