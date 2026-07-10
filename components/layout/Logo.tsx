export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-lg font-bold text-yellow-400">
        R
      </div>

      <div>
        <h1 className="text-lg font-bold text-gray-900">
          Ruby Rental
        </h1>

        <p className="text-xs text-gray-500">
          Rental Management
        </p>
      </div>
    </div>
  );
}
