"use client";

import useUserStore from "@/app/zustand-store/zustand-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignUpSuccess() {
  const router = useRouter();
  const { isUserRegistered } = useUserStore();

  useEffect(() => {
    if (!isUserRegistered) {
      router.push("/signuppage");
    }
  }, [isUserRegistered, router]);

  return (
    <div>
      You have successFully Registered an account, now you can log in to system
    </div>
  );
}
