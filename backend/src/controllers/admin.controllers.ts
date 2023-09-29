import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { db } from "../db/database";
import { users } from "../schema/schema";
import logger from "../utils/logger";
import { eq } from "drizzle-orm";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface RoleAssignBody {
  id: number;
}

export async function assignModRoleToUser(
  req: Request<{}, {}, RoleAssignBody>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.body;

  try {
    const userQuery = await db.select().from(users).where(eq(users.id, id));

    const user = userQuery[0];

    if (user.role === "Moderator") {
      throw createHttpError(400, "Cannot assign same role to a moderator");
    }

    if (user.role === "User") {
      await db.update(users).set({ role: "Moderator" }).where(eq(users.id, id));
      user.role = "Moderator";
    }

    res.status(200).json(user);
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

export async function revokeFromModToUser(
  req: Request<{}, {}, RoleAssignBody>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.body;

  try {
    const userQuery = await db.select().from(users).where(eq(users.id, id));

    const user = userQuery[0];

    if (user.role === "User") {
      throw createHttpError(400, "Cannot revoke user if it's not a moderator");
    }

    if (user.role === "Moderator") {
      await db.update(users).set({ role: "User" }).where(eq(users.id, id));
      user.role = "User";
    }

    res.status(200).json(user);
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

export async function deleteUser(
  req: Request<{}, {}, RoleAssignBody>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.body;

  try {
    const userQuery = await db.select().from(users).where(eq(users.id, id));

    const user = userQuery[0];

    const deletedUser = await db.delete(users).where(eq(users.id, user.id));


      const decodedJWT = jwt.decode(req.cookies.jwt) as JwtPayload;

      console.log(decodedJWT);

        res.clearCookie("jwt");
  
   

    if (!deletedUser) {
      throw createHttpError(404, "User not found");
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error(error);
    next(error);
  }
}
