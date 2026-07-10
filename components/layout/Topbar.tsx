export default function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Dashboard
        </h2>
        <p className="text-sm text-gray-500">
          Welcome to Ruby Rental
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-bold text-yellow-400">
          A
        </div>
      </div>
    </header>
  );
}
