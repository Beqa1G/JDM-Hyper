import express from "express";
import {
  LoginUserHandler,
  RegisterUserHandler,
  checkEmailAvailability,
  checkUsernameAvailability,
  checkphoneNumberAvailability,
  deleteUser,
  getUser,
  logout,
  updateUser,
} from "../controllers/user.controllers";
import { protectMiddleWare } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/profile", protectMiddleWare, getUser);

router.put("/profile", protectMiddleWare, updateUser);

router.delete("/profile", protectMiddleWare, deleteUser);

router.post("/register", RegisterUserHandler);

router.post("/login", LoginUserHandler);

router.post("/logout", logout);

router.post("/check-username", checkUsernameAvailability);

router.post("/check-email", checkEmailAvailability);

router.post("/check-phonenumber", checkphoneNumberAvailability);

export default router;
