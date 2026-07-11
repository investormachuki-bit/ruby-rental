"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (session) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [session, loading, router]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      Loading...
    </main>
  );
}
