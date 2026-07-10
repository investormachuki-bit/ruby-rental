export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Ruby Rental
        </h1>

        <p className="mt-3 text-gray-600">
          Simple Rental Management for Every Landlord.
        </p>

        <div className="mt-10 inline-flex items-center rounded-xl border bg-white px-5 py-3 shadow-sm">
          <span className="text-sm font-medium text-green-600">
            🚀 Deployment Successful
          </span>
        </div>
      </div>
    </main>
  );
}
