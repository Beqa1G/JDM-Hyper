import { NextFunction, Request, Response } from "express";
import { registerUser } from "../services/user.service";
import { db } from "../db/database";
import logger from "../utils/logger";
import bcrypt from "bcrypt";
import { cities, countries, gender, users } from "../schema/schema";
import createHttpError from "http-errors";
import { eq } from "drizzle-orm";
import { omit } from "lodash";
import { storeAsId } from "../utils/storeAsId";
import { isValidEmail } from "../utils/isValidEmail";

export interface RegisterBody {
  id: number;
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
  role: string;
}

export async function RegisterUserHandler(
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction
) {
  const {
    username,
    email,
    firstName,
    lastName,
    password,
    confirmPassword,
    phoneNumber,
    country,
    city,
    dateOfBirth,
    genderType,
    role,
  } = req.body;

  try {
    console.log("Received request with data:", req.body);

    const existingUserNameQuery = await db
      .select({ username: users.username })
      .from(users)
      .where(eq(users.username, username));

    const existingUserName = existingUserNameQuery[0];

    if (existingUserName) {
      throw createHttpError(409, "Username already taken");
    }

    const existingEmailQuery = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.email, email));

    const existingEmail = existingEmailQuery[0];

    if (existingEmail) {
      throw createHttpError(409, "User with this email already exists");
    }

    const validEmail = isValidEmail(email);

    if (!validEmail) {
      throw createHttpError(400, "Invalid email address format");
    }

    const existingPhoneNumberQuery = await db
      .select({ phoneNumber: users.phoneNumber })
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber));

    const existingPhoneNumber = existingPhoneNumberQuery[0];

    if (existingPhoneNumber) {
      throw createHttpError(409, "Phone Number is taken");
    }

    if (!password) {
      throw createHttpError(400, "please enter password");
    }

    if (!confirmPassword) {
      throw createHttpError(400, "please confirm your password");
    }

    if (password.length < 6) {
      throw createHttpError(400, "Password has to be 6 characters long");
    }

    if (password !== confirmPassword) {
      throw createHttpError(400, "Passwords do not match");
    }

    if (!phoneNumber) {
      throw createHttpError(400, "Enter your phone number");
    }

    if (!dateOfBirth) {
      throw createHttpError(400, "enter your phone number");
    }

    if (!genderType) {
      throw createHttpError(400, "please choose gender");
    }

    if (!country || country === "Select Country") {
      throw createHttpError(400, "Please Select country");
    }

    if (!city || city === "Select City") {
      throw createHttpError(400, "Please Select city");
    }

    const countryId = await storeAsId("countryId", country, countries);
    const cityId = await storeAsId("cityId", city, cities);
    const genderId = await storeAsId("genderId", genderType, gender);

    const hashPassword = bcrypt.hashSync(password, 10);

    console.log(countryId);

    const user = await registerUser({
      username,
      email,
      firstName,
      lastName,
      password: hashPassword,
      phoneNumber,
      countryId,
      cityId,
      dateOfBirth,
      genderId,
      role,
    });

    res.status(200).json(omit(user, "password"));
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

interface UsernameBody {
  username: string;
}

interface EmailBody {
  email: string;
}

export async function checkUsernameAvailability(
  req: Request<{}, {}, UsernameBody>,
  res: Response,
  next: NextFunction
) {
  const { username } = req.body;

  try {
    const existingUserNameQuery = await db
      .select({ username: users.username })
      .from(users)
      .where(eq(users.username, username));

    const existingUserName = existingUserNameQuery[0];

    if (existingUserName) {
      res.json({ taken: true });
    } else {
      res.json({ taken: false });
    }
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

export async function checkEmailAvailability(
  req: Request<{}, {}, EmailBody>,
  res: Response,
  next: NextFunction
) {
  const { email } = req.body;

  console.log(req.body);

  try {
    const existingEmailQuery = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.email, email));

    const existingEmail = existingEmailQuery[0];

    if (existingEmail) {
      res.json({ taken: true });
    } else {
      res.json({ taken: false });
    }
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

interface PNBody {
  phoneNumber: string;
}

export async function checkphoneNumberAvailability(
  req: Request<{}, {}, PNBody>,
  res: Response,
  next: NextFunction
) {
  const { phoneNumber } = req.body;

  try {
    const existingPhoneNumberQuery = await db
      .select({ phoneNumber: users.phoneNumber })
      .from(users)
      .where(eq(users.phoneNumber, phoneNumber));

    const existingPhoneNumber = existingPhoneNumberQuery[0];

    if (existingPhoneNumber) {
      res.json({ taken: true });
    } else {
      res.json({ taken: false });
    }
  } catch (error) {
    logger.error(error);
    next(error);
  }
}
