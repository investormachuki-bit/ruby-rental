"use client";

import Image from "next/image";

type AvatarProps = {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
};

export default function Avatar({
  name,
  imageUrl,
  size = "md",
}: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  };

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={name}
        width={56}
        height={56}
        className={`rounded-full object-cover ${sizes[size]}`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[#111111] font-semibold text-[#D4AF37] ${sizes[size]}`}
    >
      {initials}
    </div>
  );
}
