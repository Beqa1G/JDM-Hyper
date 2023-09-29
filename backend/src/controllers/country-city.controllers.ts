import { NextFunction, Request, Response } from "express";
import { db } from "../db/database";
import { countries } from "../schema/schema";
import createHttpError from "http-errors";

export async function getCountries(req:Request, res:Response, next:NextFunction) {

    try {
        const countriesQuery = await db.select().from(countries);

        if(!countriesQuery) {
            throw createHttpError(404, "Not found")
        }

        res.status(200).json(countriesQuery)
    } catch (error) {
        
    }

}