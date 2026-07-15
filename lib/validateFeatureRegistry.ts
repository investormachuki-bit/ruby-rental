import { FEATURE_REGISTRY } from "./featureRegistry";

import { getWorkspaceModules } from "@/services/settings/getWorkspaceModules";

export async function validateFeatureRegistry() {

  try {

    const modules =
      await getWorkspaceModules();

    const registry =
      new Set(
        FEATURE_REGISTRY.map(
          (feature) => feature.moduleKey
        )
      );

    const missing = modules.filter(
      (module) =>
        !registry.has(
          module.available_modules.module_key
        )
    );

    if (missing.length > 0) {

      console.warn(
        "Feature Registry is missing modules:",
        missing.map(
          (module) =>
            module.available_modules.module_key
        )
      );

    } else {

      console.info(
        "Feature Registry validation passed."
      );

    }

  } catch (error) {

    console.error(
      "Feature Registry validation failed.",
      error
    );

  }

}
