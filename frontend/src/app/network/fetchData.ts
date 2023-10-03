import { cityByCountryName } from "../models/citybycountryname";
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
  const response = await fetchData("http://localhost:1337/countries", { method: "GET" });
  return await response.json();
}



export async function fetchCitiesByCountryName(countryName: string): Promise<cityByCountryName[]> {
  const response = await fetch("http://localhost:1337/citiesbycountry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ country: countryName }),
  });

  if (!response.ok) {
    throw new Error("Error fetching cities");
  }

  return response.json();
}