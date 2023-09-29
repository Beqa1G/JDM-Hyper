import { User } from "../models/user.model";
import { fetchData } from "./fetchData";

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

export async function signUp(credentials: signUpCredentials): Promise<User> {
    const response = await fetchData("/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
  
    return response.json();
  }
