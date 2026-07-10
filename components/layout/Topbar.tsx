export default function Topbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile Menu */}
        <button className="rounded-lg p-2 hover:bg-gray-100 md:hidden">
          ☰
        </button>

        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Dashboard
          </h2>

          <p className="hidden text-sm text-gray-500 md:block">
            Welcome to Ruby Rental
          </p>
        </div>
      </div>

      <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black font-bold text-yellow-400">
        A
      </button>
    </header>
  );
}
