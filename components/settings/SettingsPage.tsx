"use client";

import { useEffect, useState } from "react";

import AppShell from "@/components/layout/AppShell";

import Breadcrumb from "@/components/common/Breadcrumb";

import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Loading from "@/components/ui/Loading";

import ModulesTab from "./ModulesTab";

import {
  getWorkspaceModules,
  WorkspaceModule,
} from "@/services/settings/getWorkspaceModules";

export default function SettingsPage() {

  const [loading, setLoading] =
    useState(true);

  const [modules, setModules] =
    useState<WorkspaceModule[]>([]);

  async function loadModules() {

    try {

      setLoading(true);

      const data =
        await getWorkspaceModules();

      setModules(data ?? []);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  }

  useEffect(() => {

    loadModules();

  }, []);

  if (loading) {

    return (

      <AppShell>

        <PageContainer>

          <Loading
            title="Loading Settings"
            description="Preparing workspace settings..."
          />

        </PageContainer>

      </AppShell>

    );

  }

  return (

    <AppShell>

      <PageContainer>

        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              href: "/",
            },
            {
              label: "Settings",
            },
          ]}
        />

        <PageHeader
          title="Settings"
          description="Configure your Ruby Rental workspace."
        />

        <Section>

          <Card>
                        <ModulesTab
              modules={modules}
              onUpdated={loadModules}
            />

          </Card>

        </Section>

      </PageContainer>

    </AppShell>

  );

}
