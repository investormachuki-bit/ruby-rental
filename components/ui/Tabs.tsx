"use client";

type Tab = {
  id: string;
  label: string;
  disabled?: boolean;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
};

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  className = "",
}: TabsProps) {

  return (

    <div
      className={`border-b border-gray-200 ${className}`}
    >

      <div className="flex flex-wrap gap-2">

        {tabs.map((tab) => {

          const active =
            activeTab === tab.id;

          return (

            <button
              key={tab.id}
              type="button"
              disabled={tab.disabled}
              onClick={() =>
                onChange(tab.id)
              }
              className={`
                border-b-2 px-5 py-3
                text-sm font-semibold
                transition-all duration-200

                ${
                  active
                    ? "border-[#D4AF37] text-[#D4AF37]"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                }

                ${
                  tab.disabled
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }
              `}
            >

              {tab.label}

            </button>

          );

        })}

      </div>

    </div>

  );

}
