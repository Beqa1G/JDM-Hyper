import express, { Request, Response, NextFunction } from "express";
import { db } from "../db/database";
import { cities, countries, users, gender, User } from "../schema/schema";
import { eq, sql } from "drizzle-orm";
import createHttpError from "http-errors";
import { registerUser } from "../services/user.service";
import { omit } from "lodash";
import logger from "../utils/logger";

const router = express.Router();

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
}

router.post(
  "/register",
  async (
    req: Request<{}, {}, RegisterBody>,
    res: Response,
    next: NextFunction
  ) => {
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
    } = req.body;

    try {
      console.log("Received request with data:", req.body);

      const SelectedCountryId = await db
        .selectDistinct({ countryId: countries.id })
        .from(countries)
        .where(eq(countries.name, country));

      const SelectedCityId = await db
        .selectDistinct({ cityId: cities.id })
        .from(cities)
        .where(eq(cities.name, city));

      const SelectedGenderId = await db
        .select({ genderId: gender.id })
        .from(gender)
        .where(eq(gender.name, genderType));

      const countryId = SelectedCountryId[0].countryId  
      const cityId = SelectedCityId[0].cityId;
      const genderId = SelectedGenderId[0].genderId;


      const user = await registerUser({
        username,
        email,
        firstName,
        lastName,
        password,
        phoneNumber,
        countryId,
        cityId,
        dateOfBirth,
        genderId,
      });

      res.status(200).json(user);
    } catch (error) {
       logger.error(error);
       next(error) ;
    }
  }
);

export default router;
