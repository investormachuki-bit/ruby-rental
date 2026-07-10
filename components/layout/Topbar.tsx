"use client";

type TopbarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

export default function Topbar({
  sidebarOpen,
  setSidebarOpen,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 md:hidden"
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 md:text-xl">
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
