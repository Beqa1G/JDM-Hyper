export interface User {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    country: string;
    city: string;
    dateOfBirth: string;
    genderType: string;
    isLoggedIn: boolean;
    role: string;
}

export interface LoginResponse {
    accessToken: string;
}