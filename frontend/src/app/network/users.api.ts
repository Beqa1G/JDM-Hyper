import { User } from "../models/user.model";
import { fetchData } from "./fetchData";

export async function getLoggedInUser(): Promise<User> {
  const response = await fetchData("http://localhost:1337/api/users/profile", {
    method: "GET",
    credentials: "include",
  });
  return response.json();
}

export interface signUpCredentials {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  country: string;
  city: string;
  dateOfBirth: string;
  genderType: string;
}

export async function register(credentials: signUpCredentials): Promise<User> {
  const response = await fetchData("http://localhost:1337/api/users/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return response.json();
}

export interface loginCredentials {
  username: string;
  password: string;
}

export async function login(credentials: loginCredentials): Promise<User> {
  const response = await fetchData("http://localhost:1337/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  return response.json();
}

export async function logout() {
  await fetchData("http://localhost:1337/api/users/logout", {
    method: "POST",
    credentials: "include",
  });
}

interface ApiResponse {
  taken: boolean;
}


export type FieldTypes = "email" | "username" | "phoneNumber";

export async function checkFields(
  FieldName: FieldTypes,
  value: string
): Promise<ApiResponse> {
  const response = await fetchData(
    `http://localhost:1337/api/users/check-${FieldName}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [FieldName]: value }),
    }
  );

  return response.json();
}
