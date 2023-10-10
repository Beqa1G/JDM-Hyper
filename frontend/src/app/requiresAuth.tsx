"use client";

import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";

export function RequiresAuth({ children }: { children: React.ReactNode }) {
  const { auth } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const protectedRoutes = ["/merchpage", "/users"];
    if (!auth && protectedRoutes.includes(pathname)) {
      console.error("Unauthorized")
      router.push("/loginpage");
    }
  }, [auth, pathname, router]);

  return <div>{children}</div>;
}
