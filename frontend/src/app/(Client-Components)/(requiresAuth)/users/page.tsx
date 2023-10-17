"use client";
import { useAuth } from "@/app/hooks/useAuth";
import { usePrivateFetch } from "../../../hooks/usePrivateFetch";
import { User } from "../../../models/user.model";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as Cookies from "tiny-cookie"

export default function Users() {
  const fetchPrivate = usePrivateFetch();
  const { auth } = useAuth();
  const router = useRouter();

  const { data: users = null, isLoading, isError } = useQuery<User[] | null>(
    ["users"],
    async () => {
      const { data, response } = await fetchPrivate("/api/auth/users", {
        method: "GET",
      });

      console.log("data:", data)
      console.log("response:", response)

      const dataPromise: User[] = await data;

      return dataPromise;
    },
    {
      retry: false,
      staleTime: 0,
      onError: () => {
        Cookies.remove("isLoggedIn");
        Cookies.remove("username");
        Cookies.remove("genderId");
        router.push("/loginpage");

      }
    }, 

  );

  if (isLoading) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      {users &&
        users.map((user) => (
          <div key={user.username}>
            <div>{user.firstName}</div>
            <div>{user.lastName}</div>
            <div>{user.username}</div>
            <div>{user.role}</div>
          </div>
        ))}
    </div>
  );
}
