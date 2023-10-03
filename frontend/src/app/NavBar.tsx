"use client";

import Link from "next/link";
import styles from "./navbar.module.css";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function NavBar() {
  const pathaname = usePathname();

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
            <nav>
              <ul className={styles.navList}>
                <li>
                  <Link
                    href={"/merchpage"}
                    className={isActive("/merchpage") ? styles.activeLink : ""}
                  >
                    Buy our Merch
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/signuppage"}
                    className={isActive("/signuppage") ? styles.activeLink : ""}
                  >
                    Signup
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/loginpage"}
                    className={isActive("/loginpage") ? styles.activeLink : ""}
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
