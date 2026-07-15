"use client";

import SettingsSection from "@/components/ui/SettingsSection";
import SettingsCard from "@/components/ui/SettingsCard";
import SettingItem from "@/components/ui/SettingItem";
import Button from "@/components/ui/Button";

export default function UsersTab() {

  return (

    <SettingsSection
      title="Users & Roles"
      description="Manage who can access this workspace."
    >

      <SettingsCard
        title="Workspace Users"
        description="Invite and manage staff members."
      >

        <div className="space-y-4">

          <SettingItem
            title="Owner"
            description="Full system access."
            action={
              <Button
                variant="secondary"
              >
                View
              </Button>
            }
          />

          <SettingItem
            title="Managers"
            description="Manage properties, tenants and payments."
            action={
              <Button
                variant="secondary"
              >
                Manage
              </Button>
            }
          />

          <SettingItem
            title="Agents"
            description="Limited operational access."
            action={
              <Button
                variant="secondary"
              >
                Manage
              </Button>
            }
          />

          <SettingItem
            title="Invite New User"
            description="Send an invitation to join this workspace."
            action={
              <Button>
                Invite User
              </Button>
            }
          />

        </div>

      </SettingsCard>

      <SettingsCard
        title="Permissions"
        description="Configure access levels for workspace users."
      >

        <div className="space-y-4">

          <SettingItem
            title="Properties"
            description="Control property management permissions."
          />

          <SettingItem
            title="Payments"
            description="Control payment recording permissions."
          />

          <SettingItem
            title="Reports"
            description="Control report viewing permissions."
          />

          <SettingItem
            title="Settings"
            description="Restrict administrative settings."
          />

        </div>

      </SettingsCard>

    </SettingsSection>

  );

}
