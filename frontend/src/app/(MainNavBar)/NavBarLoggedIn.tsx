import Link from "next/link";
import styles from "./navbar.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../network/users.api";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext, UserContextType } from "../useUser";

interface NavBarLoggedInProps {
  isActive(href: string): boolean;
}

export default function NavBarLoggedIn({ isActive }: NavBarLoggedInProps) {
  const queryClient = useQueryClient();
  const { user, setUser, isLoading } = useContext<UserContextType>(UserContext);

  const logoutMutation = useMutation(logout, {
    onSuccess: () => {
      setUser(null);
    },
  });
  const router = useRouter();

  function handleLogout() {
    try {
      logoutMutation.mutateAsync();
      router.push("/");
    } catch (error) {
      alert(error);
      console.error(error);
    }
  }
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
        <li>We are now logged In</li>
        <li>
          <button onClick={handleLogout}>logout</button>
        </li>
      </ul>
    </nav>
  );
}
