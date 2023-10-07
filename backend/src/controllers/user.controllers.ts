import { NextFunction, Request, Response } from "express";
import { registerUser } from "../services/user.service";
import { db } from "../db/database";
import logger from "../utils/logger";
import bcrypt from "bcrypt";
import { User, cities, countries, gender, users } from "../schema/schema";
import createHttpError from "http-errors";
import { eq } from "drizzle-orm";
import { omit } from "lodash";
import jwt from "jsonwebtoken";
import env from "../utils/validatedotenv";
import {
  updateAndStoreAsId,
  updatePassword,
  updateUserProperty,
} from "../utils/updateUserFunc";
import { storeAsId } from "../utils/storeAsId";
import { isValidEmail } from "../utils/isValidEmail";
import { Cookie } from "../middlewares/authMiddleware";

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

    /*     const SelectedCountryId = await db
      .select({ countryId: countries.id })
      .from(countries)
      .where(eq(countries.name, country)); */

    /* const SelectedCityId = await db
      .select({ cityId: cities.id })
      .from(cities)
      .where(eq(cities.name, city)); */

    /*     const SelectedGenderId = await db
      .select({ genderId: gender.id })
      .from(gender)
      .where(eq(gender.name, genderType)); */

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

export interface LoginBody {
  username: string;
  password: string;
}

export async function LoginUserHandler(
  req: Request<{}, {}, LoginBody>,
  res: Response,
  next: NextFunction
) {
  const { username, password } = req.body;

  try {
    const userQuery = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    const user = userQuery[0];

    const jwtObject = { username: user.username, role: user.role };

    console.log(typeof user);

    if (!user) {
      throw createHttpError(404, "Invalid Credentials");
    }

    const isValid = await bcrypt.compare(password, user.password as string);

    if (!isValid) {
      throw createHttpError(401, "Invalid Credentials");
    }

    const token = jwt.sign(jwtObject, env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30s",
    });

    const refreshToken = jwt.sign(jwtObject, env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    console.log(token);
    console.log(refreshToken);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    user.isLoggedIn = true;
    user.refreshToken = refreshToken;

    await db
      .update(users)
      .set({ isLoggedIn: true, refreshToken: refreshToken })
      .where(eq(users.id, user.id));

    res.status(200).json({ token });
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

export async function HandleRefreshToken(req:Request, res:Response, next: NextFunction) {
  const cookes: Cookie = req.cookies
}

export async function logout(req: Request, res: Response) {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); //no content
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
  });
  res.status(201).json({ message: "User logged out" });
}

/* export async function updateUser(
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction
) {
  const userQuery = await db
    .select()
    .from(users)
    .where(eq(users.id, req.user.id));
  const user = userQuery[0];

  console.log("before update: ", user);
  try {
    if (!user) {
      throw createHttpError(404, "User not  found");
    }

    if (req.body.username) {
      await db
        .update(users)
        .set({ username: req.body.username })
        .where(eq(users.id, user.id));
    }

    if (req.body.email) {
      await db
        .update(users)
        .set({ email: req.body.email })
        .where(eq(users.id, user.id));
    }

    if (req.body.firstName) {
      await db
        .update(users)
        .set({ firstName: req.body.firstName })
        .where(eq(users.id, user.id));
    }

    if (req.body.lastName) {
      await db
        .update(users)
        .set({ lastName: req.body.lastName })
        .where(eq(users.id, user.id));
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        throw createHttpError(400, "password needs to be 6 characters long");
      } else {
        const hashPassword = bcrypt.hashSync(req.body.password, 10);
        await db
          .update(users)
          .set({ password: hashPassword })
          .where(eq(users.id, user.id));
      }
    }

    console.log(req.body.password);

    if (req.body.phoneNumber) {
      await db
        .update(users)
        .set({ phoneNumber: req.body.password })
        .where(eq(users.id, user.id));
    }

    if (req.body.dateOfBirth) {
      await db
        .update(users)
        .set({ dateOfBirth: req.body.dateOfBirth })
        .where(eq(users.id, user.id));
    }

    if(req.body.country) {
      const SelectedCountryId = await db
      .select({ countryId: countries.id })
      .from(countries)
      .where(eq(countries.name, req.body.country));

      const countryId = SelectedCountryId[0].countryId;

      await db.update(users).set({ countryId}).where(eq(users.id, user.id));
    }


    if(req.body.city) {
      const SelectedCityId = await db
      .select({ cityId: cities.id })
      .from(cities)
      .where(eq(cities.name, req.body.city));

      const cityId = SelectedCityId[0].cityId;

      await db.update(users).set({ cityId}).where(eq(users.id, user.id));
    }

    if (req.body.genderType) {
      const SelectedGenderId = await db
        .select({ genderId: gender.id })
        .from(gender)
        .where(eq(gender.name, req.body.genderType));

      const genderId = SelectedGenderId[0].genderId;

      await db.update(users).set({ genderId }).where(eq(users.id, user.id));
    }

    const updatedUserQuery = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id));

    const updatedUser = updatedUserQuery[0];

    console.log("updated user: ", updatedUser);

    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error(error);
    next(error);
  }
} */

export async function updateUser(
  req: Request<{}, {}, RegisterBody>,
  res: Response,
  next: NextFunction
) {
  const userQuery = await db
    .select()
    .from(users)
    .where(eq(users.id, req.user.id));
  const user = userQuery[0];

  console.log("before update: ", user);

  try {
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const updateableProperties = [
      { key: "username", value: req.body.username },
      { key: "email", value: req.body.email },
      { key: "firstName", value: req.body.firstName },
      { key: "lastName", value: req.body.lastName },
      { key: "phoneNumber", value: req.body.phoneNumber },
      { key: "dateOfBirth", value: req.body.dateOfBirth },
    ];

    for (const property of updateableProperties) {
      if (property.value !== undefined) {
        await updateUserProperty(user.id, property.key, property.value);
      }
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        throw createHttpError(400, "Password needs to be 6 characters long");
      } else {
        await updatePassword(user.id, req.body.password);
      }
    }

    if (req.body.country) {
      await updateAndStoreAsId(
        user.id,
        "countryId",
        req.body.country,
        countries
      );
    }

    if (req.body.city) {
      await updateAndStoreAsId(user.id, "cityId", req.body.city, cities);
    }

    if (req.body.genderType) {
      await updateAndStoreAsId(
        user.id,
        "genderId",
        req.body.genderType,
        gender
      );
    }

    const updatedUserQuery = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id));

    const updatedUser = updatedUserQuery[0];

    console.log("updated user: ", updatedUser);
    console.log(user.password == updatedUser.password);

    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

export async function getUser(req: Request, res: Response) {
  const user = omit(req.user, "password");

  console.log("User data:", req.user);
  res.status(200).json(user);
}

export async function deleteUser(req: Request, res: Response) {
  const user = req.user;

  try {
    const deletedUser = await db.delete(users).where(eq(users.id, user.id));

    if (!deletedUser) {
      throw createHttpError(404, "User not found");
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    logger.error(error);
    return res
      .status(error.status || 500)
      .json({ error: error.message || "Internal server error" });
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
