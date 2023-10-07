"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getLoggedInUser } from "./network/users.api";
import { User } from "./models/user.model";
import { useQuery } from "@tanstack/react-query";

export interface UserContextType {
  user: User | null;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  setUser: () => null,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const {isLoading} = useQuery<User | null>(["loggedInUser"], getLoggedInUser, {
    onSuccess: (data) => {
      setUser(data)
    }
  })




  const contextValue: UserContextType = {
    user,
    setUser,
    isLoading,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
