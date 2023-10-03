import express from "express";
import { getCitiesByCountryName, getCountries } from "../controllers/country-city.controllers";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("api is working");
});


router.get("/countries", getCountries);

router.post("/citiesbycountry", getCitiesByCountryName);
export default router
