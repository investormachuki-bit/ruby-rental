"use client";

import { useMemo } from "react";

import SettingsSection from "@/components/ui/SettingsSection";
import SettingsCard from "@/components/ui/SettingsCard";
import SettingItem from "@/components/ui/SettingItem";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

import {
  WorkspaceModule,
} from "@/services/settings/getWorkspaceModules";

import {
  updateWorkspaceModule,
} from "@/services/settings/updateWorkspaceModule";

type Props = {

  modules: WorkspaceModule[];

  onUpdated: () => void;

};

export default function ModulesTab({

  modules,

  onUpdated,

}: Props) {

  const groupedModules =
    useMemo(() => {

      const groups: Record<
        string,
        WorkspaceModule[]
      > = {};

      modules.forEach((module) => {

        const category =
          module.available_modules.category;

        if (!groups[category]) {

          groups[category] = [];

        }

        groups[category].push(module);

      });

      return groups;

    }, [modules]);

  async function handleToggle(
    module: WorkspaceModule
  ) {

    if (
      module.available_modules.is_core
    ) {

      return;

    }

    try {

      await updateWorkspaceModule(

        module.module_id,

        !module.enabled

      );

      onUpdated();

    } catch (error: any) {

      alert(error.message);

    }

  }

  return (

    <SettingsSection
      title="Application Modules"
      description="Enable or disable optional modules for this workspace."
    >
            {Object.entries(groupedModules).map(
        ([category, categoryModules]) => (

          <SettingsCard
            key={category}
            title={category}
            description={`${categoryModules.length} module${
              categoryModules.length === 1 ? "" : "s"
            }`}
          >

            <div className="space-y-4">

              {categoryModules.map((module) => (

                <SettingItem
                  key={module.id}
                  title={
                    module.available_modules.name
                  }
                  description={
                    module.available_modules.description ??
                    ""
                  }
                  action={
                    <ToggleSwitch
                      checked={module.enabled}
                      disabled={
                        module.available_modules.is_core
                      }
                      onChange={() =>
                        handleToggle(module)
                      }
                    />
                  }
                >

                  <div className="flex flex-wrap items-center gap-2">

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">

                      {
                        module.available_modules
                          .module_key
                      }

                    </span>

                    {module.available_modules
                      .is_core && (

                      <span className="rounded-full bg-[#D4AF37]/15 px-3 py-1 text-xs font-semibold text-[#B8860B]">

                        Core Module

                      </span>

                    )}

                  </div>

                </SettingItem>

              ))}

            </div>

          </SettingsCard>

        )

      )}

    </SettingsSection>

  );

}
