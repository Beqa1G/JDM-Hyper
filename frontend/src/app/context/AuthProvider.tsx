"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";

export interface AuthData {
  accessToken: string;
}

const AuthContext = createContext<{
  auth: AuthData | null;
  setAuth: React.Dispatch<React.SetStateAction<AuthData | null>>;
}>({
  auth: null,
  setAuth: () => null,
});

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [auth, setAuth] = useState<AuthData | null>(null);
 

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
