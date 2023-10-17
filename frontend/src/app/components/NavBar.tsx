"use client";

import Link from "next/link";
import styles from "./navbar.module.css";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import NavBarLoggedOut from "./NavbarLoggedOut";
import NavBarLoggedIn from "./NavBarLoggedIn";
import { useAuth } from "../hooks/useAuth";
import PersistLogin from "../(Client-Components)/PersistLogin";
import * as Cookies from "tiny-cookie";
import { useEffect, useState } from "react";

export function NavBar() {
  const pathaname = usePathname();
  const { auth } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [genderId, setGenderId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedIsLoggedIn: boolean | null = Cookies.get("isLoggedIn");
    const storedUsername: string | null = Cookies.get("username");
    const storedGenderId: number | null = Cookies.get("genderId");

    if (isLoggedIn !== storedIsLoggedIn) {
      setIsLoggedIn(storedIsLoggedIn);
      setUsername(storedUsername);
      setGenderId(storedGenderId);
      setIsLoading(false);
    } else if (isLoggedIn === null) {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  function isActive(href: string) {
    return pathaname === href;
  }

  const navBarContent = isLoggedIn ? (
    <NavBarLoggedIn isActive={isActive} username={username} genderId={genderId}/>
  ) : (
    <NavBarLoggedOut isActive={isActive} />
  );

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
            {isLoading ? <div>loading...</div> : navBarContent}
          </div>
        </div>
      </header>
    </>
  );
}
