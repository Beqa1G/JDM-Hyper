import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import useRefreshToken from "./useRefreshToken";
import { useAuth } from "./useAuth";
import { AuthData } from "../context/AuthProvider";

export interface accessTokenObjectDecoded {
  username: string;
  iat: number;
  exp: number;
}

const BASE_URL = "http://localhost:1337";

async function originalReq(url: RequestInfo, config: RequestInit) {
  url = `${BASE_URL}${url}`;
  let response = await fetch(url, config);
  let data = response.json();

  return { response, data };
}
export function usePrivateFetch() {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  const fetchPrivate = async (url: RequestInfo, config: RequestInit = {}) => {
    let accessToken: string | undefined = auth?.accessToken;
    let isRefreshing = false;

    if (accessToken) {
      const user: accessTokenObjectDecoded = jwt_decode(accessToken);
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

      if (isExpired) {
        if (!isRefreshing) {
          isRefreshing = true;
          accessToken = await refresh();
          isRefreshing = false;
        }
      }

      config["headers"] = {
        authorization: `Bearer ${accessToken}`,
      };
    }

    let { response, data } = await originalReq(url, config);

    if (response.statusText === "Unauthorized") {
      accessToken = await refresh();

      config["headers"] = {
        authorization: `Bearer ${accessToken}`,
      };
      let newResponse = await originalReq(url, config);

      response = newResponse.response;
      data = newResponse.data;
    }

    return { response, data };
  };

  return fetchPrivate;
}
