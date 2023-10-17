"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./signuppage/singuppage.module.css";
import { usePathname } from "next/navigation";



export function AuthNavBar() {
  const pathname = usePathname();


  const isLoginPage = pathname === "/loginpage";
  const linkText = isLoginPage ? "Register" : "Login";
  const linkHref = isLoginPage ? "/signuppage" : "/loginpage";

  return (
    <header>
      <div className={styles.NavWrapper}>
        <div className={styles.logoWrapper}>
          <Image src="/JDM.png" alt="company logo" width={25} height={25} />
          <Link href={"/"} className={styles.colorBlack}>
            JDM Hyper
          </Link>
        </div>
        <nav>
          <ul>
            <li className={styles.listitem}>
              <Link className={styles.nodec} href={linkHref}>
                {linkText}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
