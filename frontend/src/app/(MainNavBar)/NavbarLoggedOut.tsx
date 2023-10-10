import Link from "next/link";
import styles from "./navbar.module.css";
import { useContext } from "react";
import { UserContext, UserContextType } from "../useUser";

interface NavBarLoggedOutProps {
  isActive(href: string): boolean;
}

export default function NavBarLoggedOut({ isActive }: NavBarLoggedOutProps) {
  const { user, isLoading } = useContext<UserContextType>(UserContext);

  return (
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
  );
}
