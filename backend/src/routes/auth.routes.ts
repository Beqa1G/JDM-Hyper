import express from "express";
import { protectMiddleWare } from "../middlewares/authMiddleware";
import {
  HandleRefreshToken,
  LoginUserHandler,
  deleteUser,
  getLoggedInUser,
  getUsers,
  logout,
  updateUser,
} from "../controllers/auth.controller";

const router = express.Router();

router.get("/loggedinuser", protectMiddleWare, getLoggedInUser);

router.get("/users", protectMiddleWare, getUsers);

router.get("/refresh", HandleRefreshToken);

router.put("/profile", protectMiddleWare, updateUser);

router.delete("/profile", protectMiddleWare, deleteUser);

router.post("/login", LoginUserHandler);

router.post("/logout", logout);

export default router;
