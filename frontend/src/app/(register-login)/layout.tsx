

import type { Metadata } from "next";


import { getLoggedInUser } from "../network/users.api";
import { UserContext, UserContextType } from "../useUser";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {




  return (
    <>
      
      <main>{children}</main>
    </>
  );
}
