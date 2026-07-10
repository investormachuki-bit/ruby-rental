"use client";

import Logo from "./Logo";

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const menuItems = [
    "Dashboard",
    "Properties",
    "Units",
    "Tenants",
    "Rent",
    "Expenses",
    "Reports",
    "Settings",
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white md:flex md:flex-col">
        <div className="border-b border-gray-200 p-6">
          <Logo />
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li
                key={item}
                className={`cursor-pointer rounded-lg px-4 py-3 transition ${
                  index === 0
                    ? "bg-gray-100 font-semibold text-gray-900"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 transform bg-white shadow-xl transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-gray-200 p-6">
          <Logo />
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li
                key={item}
                onClick={() => setSidebarOpen(false)}
                className={`cursor-pointer rounded-lg px-4 py-3 transition ${
                  index === 0
                    ? "bg-gray-100 font-semibold text-gray-900"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
