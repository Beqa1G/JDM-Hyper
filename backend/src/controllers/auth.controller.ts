import { NextFunction, Request, Response } from "express";
import { db } from "../db/database";
import logger from "../utils/logger";
import bcrypt from "bcrypt";
import { cities, countries, gender, users } from "../schema/schema";
import createHttpError from "http-errors";
import { eq } from "drizzle-orm";
import { omit } from "lodash";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../utils/validatedotenv";
import {
  updateAndStoreAsId,
  updatePassword,
  updateUserProperty,
} from "../utils/updateUserFunc";

import { Cookie } from "../middlewares/authMiddleware";
import { RegisterBody } from "./user.controllers";

export async function getLoggedInUser(req: Request, res: Response) {
  const user = omit(req.user, ["password", "refreshToken"]);

  res.status(200).json(user);
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

  console.log(username);

  try {
    const userQuery = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    const user = userQuery[0];


    if (!user) {
      throw createHttpError(401, "Invalid Credentials");
    }

    const isValid = await bcrypt.compare(password, user.password as string);

    if (!isValid) {
      throw createHttpError(401, "Invalid Credentials");
    }

    const jwtObject = { username: user.username };

    const accessToken = jwt.sign(jwtObject, env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15s",
    });

    const refreshToken = jwt.sign(jwtObject, env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    console.log(accessToken);
    console.log(refreshToken);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.cookie("username", user.username, {
      sameSite: "strict",
    });

    res.cookie("genderId", user.genderId, {
      sameSite: "strict",
    });

    user.isLoggedIn = true;
    user.refreshToken = refreshToken;

    await db
      .update(users)
      .set({ isLoggedIn: true, refreshToken: refreshToken })
      .where(eq(users.id, user.id));

    const sanitizedUser = omit(user, ["password", "refreshToken"]);

    res.status(200).json({ accessToken });
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

export async function HandleRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const cookies: Cookie = req.cookies;

  const refreshToken = cookies.jwt;

  if (!refreshToken) {
    next(createHttpError(401, "Unauthorized, no refresh token"));
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      env.REFRESH_TOKEN_SECRET
    ) as JwtPayload;
    console.log("Decoded JWT Payload:", decoded);

    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, decoded.username));
    const result = user[0];

    const accessToken = jwt.sign(
      { username: result.username },
      env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15s",
      }
    );

    const sanitizedUser = omit(result, ["password", "refreshToken"]);

    res.status(201).json({ accessToken });
  } catch (error) {
    next(createHttpError(403, "Forbidden"));
  }
}

export async function logout(req: Request, res: Response) {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
  });
  res.clearCookie("username", {
    sameSite: "strict",
  });
  res.clearCookie("genderId", {
    sameSite: "strict",
  });
  res.status(201).json({ message: "User logged out" });
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userQuery = await db
    .select()
    .from(users)
    .where(eq(users.id, req.user.id));
  const user = userQuery[0];


  console.log(req.body)

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

export async function getUsers(req: Request, res: Response) {
  const user = await db.select().from(users);

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

    res.clearCookie("username", {
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
