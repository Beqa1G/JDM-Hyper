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

export async function register(credentials: signUpCredentials): Promise<User> {
    const response = await fetchData(" http://localhost:1337/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
  
    return response.json();
  }

  interface ApiResponse {
    taken: boolean;
  }

  export async function checkEmail(request: string): Promise<ApiResponse> {
    const response = await fetchData("http://localhost:1337/api/users/check-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email: request}),
    })

    return response.json();
  }


  export async function checkUsername(request:string): Promise<ApiResponse> {
    const response = await fetchData("http://localhost:1337/api/users/check-username", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({username: request}),
    })

    return response.json();
  }

  export type FieldTypes = "email" | "username" | "phoneNumber";

  export async function checkFields(FieldName: FieldTypes, value: string): Promise<ApiResponse> {
    const response = await fetchData(`http://localhost:1337/api/users/check-${FieldName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({  [FieldName]: value }),
    })

    return response.json()
  }
