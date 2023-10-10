import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./provider";
import { UserProvider } from "./useUser";
import { AuthContextProvider } from "./context/AuthProvider";
import { RequiresAuth } from "./requiresAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buy the best quality cars and parts",
  description: "Buy cars and parts from JDM Hyper",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthContextProvider>
            <RequiresAuth>
              <main>{children}</main>
            </RequiresAuth>
          </AuthContextProvider>
        </Providers>
      </body>
    </html>
  );
}
