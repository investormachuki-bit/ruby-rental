import {
  FEATURE_REGISTRY,
  Feature,
} from "@/lib/featureRegistry";

import {
  getWorkspaceModules,
} from "./getWorkspaceModules";

export async function getEnabledFeatures(): Promise<Feature[]> {

  const workspaceModules =
    await getWorkspaceModules();

  const enabledModules =
    new Set(
      workspaceModules
        .filter(
          (module) => module.enabled
        )
        .map(
          (module) =>
            module.available_modules
              .module_key
        )
    );

  return FEATURE_REGISTRY.filter(
    (feature) =>
      feature.core ||
      enabledModules.has(
        feature.moduleKey
      )
  );

}
