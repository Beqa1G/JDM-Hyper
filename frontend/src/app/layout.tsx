import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NavBar } from "./NavBar";
import Providers from "./provider";

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
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
