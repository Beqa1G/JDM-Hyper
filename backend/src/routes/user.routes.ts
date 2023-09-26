import express from "express";
import { LoginUserHandler, RegisterUserHandler, assignModRoleToUser, deleteUser, getUser, logout, updateUser } from "../controllers/user.controllers";
import { protectMiddleWare } from "../middlewares/authMiddleware";
import { roleValidationMiddleware } from "../middlewares/roleValidationMiddleware";

const router = express.Router();


router.get("/profile", protectMiddleWare, getUser);

router.put("/profile", protectMiddleWare, updateUser);

router.delete("/profile", protectMiddleWare, deleteUser);

router.put("/assign", protectMiddleWare, roleValidationMiddleware("Admin"), assignModRoleToUser);

router.post("/register", RegisterUserHandler);

router.post("/login", LoginUserHandler);

router.post("/logout", logout)

export default router;
