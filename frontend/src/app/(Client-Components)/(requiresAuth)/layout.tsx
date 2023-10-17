"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import PersistLogin from "../PersistLogin";
import dynamic from "next/dynamic";
import * as Cookies from "tiny-cookie"

const DynamicNavBar = dynamic(() => import("../../components/NavBar").then((module) => module.NavBar), {
  ssr:false
})

export default function RequiresAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = Cookies.get("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/loginpage");
    }
  }, []);
  
  return (
    <>
      <DynamicNavBar />
      <PersistLogin>{children}</PersistLogin>
    </>
  );
}
