import express from "express";
import { protectMiddleWare } from "../middlewares/authMiddleware";
import { roleValidationMiddleware } from "../middlewares/roleValidationMiddleware";
import {
  assignModRoleToUser,
  deleteUser,
  revokeFromModToUser,
} from "../controllers/admin.controllers";

const router = express.Router();

router.put(
  "/assign",
  protectMiddleWare,
  roleValidationMiddleware("Admin"),
  assignModRoleToUser
);

router.put(
  "/revoke",
  protectMiddleWare,
  roleValidationMiddleware("Admin"),
  revokeFromModToUser
);


router.delete("/deleteUser", protectMiddleWare, roleValidationMiddleware("Admin"), deleteUser);

export default router;
