import { LoginResponse, User } from "../models/user.model";
import { fetchData } from "./fetchData";

export async function getLoggedInUser(): Promise<User> {
  const response = await fetchData("http://localhost:1337/auth/users/loggedinuser", {
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

export async function login(
  credentials: loginCredentials
): Promise<LoginResponse> {
  const response = await fetchData("http://localhost:1337/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    console.log(response);
  }

  return response.json();
}

export async function logout() {
  await fetchData("http://localhost:1337/api/auth/logout", {
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


export async function getUsers(): Promise<User[]> {
      const response = await fetchData("http://localhost:1337/api/auth/users", {
      method: "GET"
    });

    return response.json()
}

export interface editUserCredentials {
  username: string;
  email: string;
}

