import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import logger from "../utils/logger";

export function roleValidationMiddleware(roleToCheck: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user ? req.user.role : null;
    try {
      if (userRole === roleToCheck) {
        next();
      } else {
        next(createHttpError(403, "insufficient permissions"));
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };
}
