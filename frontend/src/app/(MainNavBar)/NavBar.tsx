"use client";

import Link from "next/link";
import styles from "./navbar.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
import NavBarLoggedOut from "./NavbarLoggedOut";
import NavBarLoggedIn from "./NavBarLoggedIn";
import { useContext } from "react";
import { UserContext, UserContextType } from "../useUser";

export function NavBar() {
  const pathaname = usePathname();
  const { user, isLoading } = useContext<UserContextType>(UserContext);

  function isActive(href: string) {
    return pathaname === href;
  }

  console.log(user?.isLoggedIn);
  console.log("loading user:" + isLoading);

  if(isLoading) {
    return <div>loading...</div>
  }

  return (
    <>
        <header>
          <div className={styles.container}>
            <div className={styles.NavWrapper}>
              <div className={styles.logoWrapper}>
                <Image
                  src="/JDM.png"
                  alt="company logo"
                  width={25}
                  height={25}
                />
                <Link
                  href={"/"}
                  className={isActive("/") ? styles.activeLink : ""}
                >
                  JDM Hyper
                </Link>
              </div>

              {user  ? (
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
