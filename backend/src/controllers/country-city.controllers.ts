import { NextFunction, Request, Response } from "express";
import { db } from "../db/database";
import { cities, countries } from "../schema/schema";
import createHttpError from "http-errors";
import { eq } from "drizzle-orm";
import logger from "../utils/logger";

export async function getCountries(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const countriesQuery = await db.select().from(countries);

    if (!countriesQuery) {
      throw createHttpError(404, "Not found");
    }

    res.status(200).json(countriesQuery);
  } catch (error) {
    logger.error(error);
    next(error);
  }
}

export interface getCitiesReqBody {
  country: string;
}

export async function getCitiesByCountryName(
  req: Request<{}, {}, getCitiesReqBody>,
  res: Response,
  next: NextFunction
) {
  const { country } = req.body;

  try {
    const countrySubQuery = await db
      .select({ countryID: countries.id })
      .from(countries)
      .where(eq(countries.name, country));

    const subquery = countrySubQuery[0];

    const citiesQuery = await db
      .select({ cityName: cities.name, cityId: cities.id })
      .from(cities)
      .where(eq(cities.countryId, subquery.countryID));

    if (!citiesQuery) {
      throw createHttpError(404, "No cities found");
    }

    if (country !== "Select Country") {
      res.status(200).json(citiesQuery);
    }
    
  } catch (error) {
    logger.error(error);
    next(error);
  }
}
