import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3"
    >
      <Image
        src="/logo.png"
        alt="Ruby Rental"
        width={48}
        height={48}
        priority
        className="h-12 w-12 object-contain"
      />

      <div>

        <h1 className="text-lg font-bold text-white">
          Ruby Rental
        </h1>

        <p className="text-xs text-gray-400">
          Rental Management
        </p>

      </div>

    </Link>
  );
}
