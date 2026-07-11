import AppShell from "@/components/layout/AppShell";

export default function HomePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-1 text-gray-600">
            Welcome to Ruby Rental.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">
              Monthly Rent
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              KSh 0
            </h2>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">
              Collected
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              KSh 0
            </h2>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">
              Outstanding
            </p>

            <h2 className="mt-1 text-2xl font-bold text-red-600">
              KSh 0
            </h2>
          </div>

          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-gray-500">
              Vacant Units
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              0
            </h2>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>

          <p className="mt-3 text-gray-500">
            No activity available.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
