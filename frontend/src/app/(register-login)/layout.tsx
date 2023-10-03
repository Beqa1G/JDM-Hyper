import type { Metadata } from "next";
import { SignUpPageNavBar } from "./signuppage/SignupPageNavBar";


export const metadata: Metadata = {
  title: "Registration page",
  description: "Buy cars and parts from JDM Hyper",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SignUpPageNavBar />
      <main>{children}</main>
    </>
  );
}
