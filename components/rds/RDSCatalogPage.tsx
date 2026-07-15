"use client";

import AppShell from "@/components/layout/AppShell";

import Breadcrumb from "@/components/common/Breadcrumb";

import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";

import SettingsCard from "@/components/ui/SettingsCard";

import Button from "@/components/ui/Button";
import ToggleSwitch from "@/components/ui/ToggleSwitch";

import { useState } from "react";
import SettingItem from "@/components/ui/SettingItem";

export default function RDSCatalogPage() {

  const [enabled, setEnabled] =
    useState(true);

  return (

    <AppShell>

      <PageContainer>

        <Breadcrumb
          items={[
            {
              label: "Development",
            },
            {
              label: "Ruby Design System",
            },
          ]}
        />

        <PageHeader
          title="Ruby Design System"
          description="Living documentation for all reusable UI components."
        />

        <Section>

          <SettingsCard
            title="Buttons"
            description="Standard buttons used throughout Ruby Rental."
          >

            <div className="flex flex-wrap gap-4">

              <Button
                variant="primary"
              >
                Primary
              </Button>

              <Button
                variant="secondary"
              >
                Secondary
              </Button>

              <Button
                variant="danger"
              >
                Danger
              </Button>

              <Button
                loading
              >
                Loading
              </Button>

            </div>

          </SettingsCard>

        </Section>
                <Section>

          <SettingsCard
            title="Interaction Components"
            description="Reusable interactive controls."
          >

            <div className="space-y-8">

              <ToggleSwitch
                label="Enable Maintenance Module"
                description="Example ToggleSwitch component."
                checked={enabled}
                onChange={setEnabled}
              />

              <ToggleSwitch
                label="Disabled Toggle"
                description="Example disabled state."
                checked={false}
                disabled
                onChange={() => {}}
              />

            </div>

          </SettingsCard>

        </Section>

        <Section>

          <SettingsCard
            title="Settings Components"
            description="Reusable settings building blocks."
          >

            <div className="space-y-5">

              <SettingItem
                title="Maintenance Module"
                description="Track repairs and maintenance requests."
                action={
                  <ToggleSwitch
                    checked={enabled}
                    onChange={setEnabled}
                  />
                }
              />

              <SettingItem
                title="Reports"
                description="Enable reporting dashboards."
                action={
                  <Button variant="secondary">
                    Configure
                  </Button>
                }
              />

            </div>

          </SettingsCard>

        </Section>
                <Section>

          <SettingsCard
            title="Design Principles"
            description="The standards every Ruby product follows."
          >

            <div className="grid gap-6 md:grid-cols-2">

              <div className="rounded-2xl border p-5">

                <h3 className="text-lg font-semibold">

                  Reusable First

                </h3>

                <p className="mt-2 text-gray-600">

                  If a UI pattern appears more than once,
                  it belongs in the Ruby Design System.

                </p>

              </div>

              <div className="rounded-2xl border p-5">

                <h3 className="text-lg font-semibold">

                  Consistency

                </h3>

                <p className="mt-2 text-gray-600">

                  Every page should feel like part of
                  the same application regardless of
                  who built it.

                </p>

              </div>

              <div className="rounded-2xl border p-5">

                <h3 className="text-lg font-semibold">

                  Accessibility

                </h3>

                <p className="mt-2 text-gray-600">

                  Components should support keyboard
                  navigation, focus states and screen
                  readers.

                </p>

              </div>

              <div className="rounded-2xl border p-5">

                <h3 className="text-lg font-semibold">

                  Mobile First

                </h3>

                <p className="mt-2 text-gray-600">

                  Every component must work beautifully
                  on phones before desktops.

                </p>

              </div>

            </div>

          </SettingsCard>

        </Section>

        <Section>

          <SettingsCard
            title="Ruby Design System Status"
            description="Current implementation progress."
          >

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

              <SettingItem
                title="Foundation"
                description="Layout, Cards, Buttons"
                action={
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    Complete
                  </span>
                }
              />

              <SettingItem
                title="Forms"
                description="Inputs and form controls"
                action={
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    Complete
                  </span>
                }
              />

              <SettingItem
                title="Interaction"
                description="Toggle, Dialogs, Menus"
                action={
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                    In Progress
                  </span>
                }
              />

              <SettingItem
                title="Navigation"
                description="Breadcrumbs, Tabs"
                action={
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                    In Progress
                  </span>
                }
              />

              <SettingItem
                title="Data Display"
                description="Tables, Lists, Charts"
                action={
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
                    Planned
                  </span>
                }
              />

              <SettingItem
                title="Settings"
                description="Workspace configuration"
                action={
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                    Complete
                  </span>
                }
              />

            </div>

          </SettingsCard>

        </Section>

      </PageContainer>

    </AppShell>

  );

}
