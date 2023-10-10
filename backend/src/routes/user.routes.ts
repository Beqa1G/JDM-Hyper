import express from "express";
import {
  RegisterUserHandler,
  checkEmailAvailability,
  checkUsernameAvailability,
  checkphoneNumberAvailability,
} from "../controllers/user.controllers";
import { protectMiddleWare } from "../middlewares/authMiddleware";

const router = express.Router();


router.post("/register", RegisterUserHandler);

router.post("/check-username", checkUsernameAvailability);

router.post("/check-email", checkEmailAvailability);

router.post("/check-phonenumber", checkphoneNumberAvailability);

export default router;
