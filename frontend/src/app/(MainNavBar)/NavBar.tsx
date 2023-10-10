"use client";

import Link from "next/link";
import styles from "./navbar.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
import NavBarLoggedOut from "./NavbarLoggedOut";
import NavBarLoggedIn from "./NavBarLoggedIn";
import { useContext } from "react";
import { UserContext, UserContextType } from "../useUser";
import { useAuth } from "../hooks/useAuth";

export function NavBar() {
  const pathaname = usePathname();
  const { auth } = useAuth();

  function isActive(href: string) {
    return pathaname === href;
  }

  return (
    <>
      <header>
        <div className={styles.container}>
          <div className={styles.NavWrapper}>
            <div className={styles.logoWrapper}>
              <Image src="/JDM.png" alt="company logo" width={25} height={25} />
              <Link
                href={"/"}
                className={isActive("/") ? styles.activeLink : ""}
              >
                JDM Hyper
              </Link>
            </div>
            {auth && auth.accessToken ? (
              <NavBarLoggedIn isActive={isActive} />
            ) : (
              <NavBarLoggedOut isActive={isActive} />
            )}
          </div>
        </div>
      </header>
    </>
  );
}
