import express from "express";
import {
  LoginUserHandler,
  RegisterUserHandler,
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

export default router;
