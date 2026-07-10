import Logo from "./Logo";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <Logo />
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          <li className="rounded-lg bg-gray-100 px-4 py-3 font-medium text-gray-900">
            Dashboard
          </li>

          <li className="rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100">
            Properties
          </li>

          <li className="rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100">
            Units
          </li>

          <li className="rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100">
            Tenants
          </li>

          <li className="rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100">
            Rent
          </li>

          <li className="rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100">
            Expenses
          </li>

          <li className="rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100">
            Reports
          </li>

          <li className="rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-100">
            Settings
          </li>
        </ul>
      </nav>
    </aside>
  );
}
