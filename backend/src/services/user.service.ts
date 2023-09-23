import { db } from "../db/database";
import { NewUser, users } from "../schema/schema";

export async function registerUser(newUser: NewUser) {
   const result = await db.insert(users).values(newUser).returning({
    id: users.id,
    username: users.username,
    email: users.email,
    firstName: users.firstName,
    lastName: users.lastName,
    password: users.password,
    phoneNumber: users.phoneNumber,
    countryId: users.countryId,
    cityId: users.cityId,
    dateOfBirth: users.dateOfBirth,
    genderId: users.genderId,
  });

  if (result.length > 0) {
    // Check if any records were returned
    return result[0]; // Return the first (and only) record
  } else {
    throw new Error("User registration failed"); // Handle the case where no records were returned
  }
}
