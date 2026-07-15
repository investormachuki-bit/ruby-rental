"use client";

import SettingsSection from "@/components/ui/SettingsSection";
import SettingsCard from "@/components/ui/SettingsCard";
import SettingItem from "@/components/ui/SettingItem";
import Button from "@/components/ui/Button";

export default function WorkspaceTab() {

  return (

    <SettingsSection
      title="Workspace"
      description="Manage your company and workspace information."
    >

      <SettingsCard
        title="Company Profile"
        description="Basic information about your business."
      >

        <div className="space-y-4">

          <SettingItem
            title="Company Name"
            description="Ruby Rental Workspace"
            action={
              <Button
                variant="secondary"
              >
                Edit
              </Button>
            }
          />

          <SettingItem
            title="Company Logo"
            description="Upload your company logo."
            action={
              <Button>
                Upload
              </Button>
            }
          />

          <SettingItem
            title="Business Phone"
            description="Primary contact number."
            action={
              <Button
                variant="secondary"
              >
                Edit
              </Button>
            }
          />

          <SettingItem
            title="Business Email"
            description="Primary business email."
            action={
              <Button
                variant="secondary"
              >
                Edit
              </Button>
            }
          />

        </div>

      </SettingsCard>

      <SettingsCard
        title="Regional Settings"
        description="Workspace defaults."
      >

        <div className="space-y-4">

          <SettingItem
            title="Currency"
            description="Kenyan Shilling (KES)"
          />

          <SettingItem
            title="Country"
            description="Kenya"
          />

          <SettingItem
            title="Time Zone"
            description="Africa/Nairobi"
          />

          <SettingItem
            title="Date Format"
            description="DD/MM/YYYY"
          />

        </div>

      </SettingsCard>

    </SettingsSection>

  );

}
