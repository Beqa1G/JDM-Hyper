import express from "express";
import { getCountries } from "../controllers/country-city.controllers";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("api is working");
});


router.get("/countries", getCountries)
export default router
