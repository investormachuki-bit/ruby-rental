"use client";

import SettingsSection from "@/components/ui/SettingsSection";
import SettingsCard from "@/components/ui/SettingsCard";
import SettingItem from "@/components/ui/SettingItem";
import Button from "@/components/ui/Button";

export default function BillingTab() {

  return (

    <SettingsSection
      title="Billing"
      description="Manage your Ruby Rental subscription."
    >

      <SettingsCard
        title="Subscription"
        description="Your current workspace subscription."
      >

        <div className="space-y-4">

          <SettingItem
            title="Current Plan"
            description="Professional Plan"
          />

          <SettingItem
            title="Billing Status"
            description="Active"
          />

          <SettingItem
            title="Renewal Date"
            description="Not available"
          />

          <SettingItem
            title="Upgrade Plan"
            description="Unlock additional features and modules."
            action={
              <Button>
                Upgrade
              </Button>
            }
          />

        </div>

      </SettingsCard>

      <SettingsCard
        title="Payment Methods"
        description="Manage subscription payment methods."
      >

        <div className="space-y-4">

          <SettingItem
            title="Primary Payment Method"
            description="No payment method configured."
          />

          <SettingItem
            title="Billing History"
            description="View previous subscription invoices."
            action={
              <Button
                variant="secondary"
              >
                View
              </Button>
            }
          />

        </div>

      </SettingsCard>

    </SettingsSection>

  );

}
