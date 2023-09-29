import { Country } from "../models/country";

export async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    throw Error(errorMessage);
  }
}

export async function fetchCountries(): Promise<Country[]> {
  const response = await fetchData("/countries", { method: "GET" });
  return await response.json();
}
