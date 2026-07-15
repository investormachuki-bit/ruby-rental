"use client";

import { useEffect, useState } from "react";

import {
  Feature,
} from "@/lib/featureRegistry";

import {
  getEnabledFeatures,
} from "@/services/settings/getEnabledFeatures";

export function useEnabledFeatures() {

  const [features, setFeatures] =
    useState<Feature[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function load() {

      try {

        setLoading(true);

        const data =
          await getEnabledFeatures();

        setFeatures(data);

      } catch (error) {

        console.error(
          "Failed to load enabled features.",
          error
        );

      } finally {

        setLoading(false);

      }

    }

    load();

  }, []);

  return {

    features,

    loading,

  };

}
