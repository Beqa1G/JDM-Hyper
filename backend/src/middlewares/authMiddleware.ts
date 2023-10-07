import jwt, { JwtPayload } from "jsonwebtoken";
import createHttpError from "http-errors";
import env from "../utils/validatedotenv";
import { Request, Response, NextFunction } from "express";
import { db } from "../db/database";
import { users } from "../schema/schema";
import { eq } from "drizzle-orm";

export interface Cookie {
  jwt: string;
}

export async function protectMiddleWare(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const cookie: Cookie = req.cookies 

  const token = cookie.jwt;
  

  if (token) {
    try {
      const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
      console.log("Decoded JWT Payload:", decoded);

      const user = await db
        .select()
        .from(users)
        .where(eq(users.username, decoded.username));
      const result = user[0];
      req.user = result;

      next();
    } catch (error) {
      next(createHttpError(401, "Not Authorized, invalid token"));
    }
  } else {
    next(createHttpError(401, "Unauthorized"));
  }
}
