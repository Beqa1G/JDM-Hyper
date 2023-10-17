import Link from "next/link";
import styles from "./navbar.module.css";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../network/users.api";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import * as Cookies from "tiny-cookie";
import Image from "next/image";

interface NavBarLoggedInProps {
  isActive(href: string): boolean;
  username: string | null;
  genderId: number | null;
}

export default function NavBarLoggedIn({
  isActive,
  username,
  genderId,
}: NavBarLoggedInProps) {
  const { setAuth } = useAuth();

  const logoutMutation = useMutation(logout, {
    onSuccess: () => {
      setAuth(null);
    },
  });

  const { isSuccess } = logoutMutation;

  const router = useRouter();

  function handleLogout() {
    try {
      logoutMutation.mutateAsync();
      Cookies.remove("isLoggedIn");
      router.push("/loginpage");
    } catch (error) {
      alert(error);
      console.error(error);
    }
  }

  return (
    <>
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
            <div className={styles.username}>{username}</div>
          </li>
          <li>
            {genderId == 1 ? (
              <Image
                src="/man.png"
                width={30}
                height={30}
                alt="Man Profile Picture"
              />
            ) : (
              <Image
                src="/woman.png"
                width={30}
                height={30}
                alt="Woman Profile Picture"
              />
            )}
          </li>
          <li>
            <Link
              href={"/settings"}
              className={isActive("/users") ? styles.activeLink : ""}
            >
              {
                <Image
                  src="/gear.png"
                  width={25}
                  height={25}
                  alt="settings page"
                ></Image>
              }
            </Link>
          </li>
          <li>
            <button
              className={styles.navBarLoggedInButton}
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
