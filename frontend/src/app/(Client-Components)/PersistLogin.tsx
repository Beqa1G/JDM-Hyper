"use client";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function PersistLogin({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  const refresh = useRefreshToken();
  const router = useRouter();

  
  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);



  }, []);



  return <>{isLoading ? <div>loading...</div> : children}</>;
}
