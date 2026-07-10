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

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-sm border">
            <p className="text-sm text-gray-500">
              Monthly Rent
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              KSh 0
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm border">
            <p className="text-sm text-gray-500">
              Collected
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              KSh 0
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm border">
            <p className="text-sm text-gray-500">
              Outstanding
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-600">
              KSh 0
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm border">
            <p className="text-sm text-gray-500">
              Vacant Units
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              0
            </h2>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">
            Recent Activity
          </h3>

          <p className="mt-4 text-gray-500">
            No activity available.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
