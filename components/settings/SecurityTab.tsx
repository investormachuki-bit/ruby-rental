"use client";

import SettingsSection from "@/components/ui/SettingsSection";
import SettingsCard from "@/components/ui/SettingsCard";
import SettingItem from "@/components/ui/SettingItem";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import Button from "@/components/ui/Button";

import { useState } from "react";

export default function SecurityTab() {

  const [
    twoFactor,
    setTwoFactor,
  ] = useState(false);

  const [
    sessionTimeout,
    setSessionTimeout,
  ] = useState(true);

  return (

    <SettingsSection
      title="Security"
      description="Manage authentication and workspace security."
    >

      <SettingsCard
        title="Authentication"
        description="Protect access to your workspace."
      >

        <div className="space-y-5">

          <SettingItem
            title="Two-Factor Authentication"
            description="Require a second verification step when signing in."
            action={
              <ToggleSwitch
                checked={twoFactor}
                onChange={setTwoFactor}
              />
            }
          />

          <SettingItem
            title="Session Timeout"
            description="Automatically sign users out after inactivity."
            action={
              <ToggleSwitch
                checked={sessionTimeout}
                onChange={setSessionTimeout}
              />
            }
          />

          <SettingItem
            title="Change Password"
            description="Update your account password."
            action={
              <Button variant="secondary">
                Change
              </Button>
            }
          />

        </div>

      </SettingsCard>

      <SettingsCard
        title="Workspace Security"
        description="Review security activity and access."
      >

        <div className="space-y-5">

          <SettingItem
            title="Active Sessions"
            description="View devices currently signed into this workspace."
            action={
              <Button variant="secondary">
                View
              </Button>
            }
          />

          <SettingItem
            title="Audit Log"
            description="Review important security events."
            action={
              <Button variant="secondary">
                View
              </Button>
            }
          />

        </div>

      </SettingsCard>

    </SettingsSection>

  );

}
