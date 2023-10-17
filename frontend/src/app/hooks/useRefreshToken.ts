import { SetStateAction } from "react";
import { AuthData } from "../context/AuthProvider";
import { fetchData } from "../network/fetchData";
import { useAuth } from "./useAuth";

interface refreshEndpointResponse {
  accessToken: string;
}

export default function useRefreshToken() {
  const { setAuth } = useAuth();

  async function refresh(): Promise<string> {
    const response = await fetchData("http://localhost:1337/api/auth/refresh", {
      method: "GET",
      credentials: "include",
    });

    const data: refreshEndpointResponse = await response.json();

    setAuth((prevAuth: AuthData | null) => {

      return {
        ...prevAuth,
        accessToken: data.accessToken,
      };
    });
    return data.accessToken;
  }

  return refresh;
}
