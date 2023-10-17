"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import * as Cookies from "tiny-cookie";

export default function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loggedIn = Cookies.getCookie("isLoggedIn");
    function checkLogin() {
      if (loggedIn) {
        setIsLoading(false)
        router.push("/");
      } else{
        setIsLoading(false)
      }

    }

    checkLogin()
   
  }, [isLoading]);

  return <>{isLoading ? <div>loading...</div> : <main>{children}</main>}</>;
}
