"use client";

import Image from "next/image";
import { useState } from "react";

export default function Logo() {
  const [imageError, setImageError] =
    useState(false);

  return (
    <div className="flex items-center gap-3">

      {!imageError ? (

        <Image
          src="/logo.png"
          alt="Ruby Rental"
          width={46}
          height={46}
          priority
          className="h-11 w-11 rounded-xl object-contain"
          onError={() =>
            setImageError(true)
          }
        />

      ) : (

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37] text-lg font-bold text-[#0F0F10] shadow-lg">

          R

        </div>

      )}

      <div>

        <h1 className="text-lg font-bold tracking-wide text-white">

          Ruby Rental

        </h1>

        <p className="text-xs tracking-wide text-gray-400">

          Rental Management

        </p>

      </div>

    </div>
  );
}
