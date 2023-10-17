import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import useRefreshToken from "./useRefreshToken";
import { useAuth } from "./useAuth";
import { accessTokenObjectDecoded } from "./usePrivateFetch";

const useFetch = () => {
  const refresh = useRefreshToken();
  const { auth, setAuth } = useAuth();

  const BASE_URL = "http://localhost:1337";

  async function originalReq(url: RequestInfo, config: RequestInit) {
    url = `${BASE_URL}${url}`;
    let response = await fetch(url, config);
    let data = response.json();

    return { response, data };
  }

  async function callFetch(url: RequestInfo, config: RequestInit = {}) {
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

      const newHeaders = {
        ...config.headers, 
        authorization: `Bearer ${accessToken}`,
      };

      config.headers = newHeaders;
    }

    let { response, data } = await originalReq(url, config);
    return {response, data}
  }

  return callFetch;
};

export default useFetch;
