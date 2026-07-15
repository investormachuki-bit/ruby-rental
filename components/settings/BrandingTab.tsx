"use client";

import SettingsSection from "@/components/ui/SettingsSection";
import SettingsCard from "@/components/ui/SettingsCard";
import SettingItem from "@/components/ui/SettingItem";
import Button from "@/components/ui/Button";

export default function BrandingTab() {

  return (

    <SettingsSection
      title="Branding"
      description="Customize the appearance of your workspace."
    >

      <SettingsCard
        title="Workspace Branding"
        description="Configure how your company appears throughout Ruby Rental."
      >

        <div className="space-y-4">

          <SettingItem
            title="Company Logo"
            description="Displayed on receipts, invoices and reports."
            action={
              <Button>
                Upload Logo
              </Button>
            }
          />

          <SettingItem
            title="Primary Brand Colour"
            description="Used across the application."
            action={
              <Button variant="secondary">
                Change
              </Button>
            }
          />

          <SettingItem
            title="Receipt Footer"
            description="Printed on receipts and invoices."
           
