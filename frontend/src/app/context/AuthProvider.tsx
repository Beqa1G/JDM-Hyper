"use client";

import React, { createContext, useContext, useState } from "react";

interface AuthData {
  username: string;
  password: string;
  accessToken: string;
  role: string;
}

const AuthContext = createContext<{
  auth: AuthData | null;
  setAuth: (authData: AuthData) => void;
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

  console.log(auth);
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
