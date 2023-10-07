import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./provider";
import { UserProvider } from "./useUser";

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
          <UserProvider>
            <main>{children}</main>
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
