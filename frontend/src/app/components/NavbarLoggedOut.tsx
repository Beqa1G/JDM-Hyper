import Link from "next/link";
import styles from "./navbar.module.css";


interface NavBarLoggedOutProps {
  isActive(href: string): boolean;
}

export default function NavBarLoggedOut({ isActive }: NavBarLoggedOutProps) {
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
