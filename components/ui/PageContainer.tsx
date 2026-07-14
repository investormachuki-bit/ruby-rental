"use client";

import { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <div
      className={`
        mx-auto
        w-full
        max-w-7xl
        space-y-8
        ${className}
      `}
    >
      {children}
    </div>
  );
}
