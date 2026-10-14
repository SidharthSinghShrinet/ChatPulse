import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  getLoggedInUser,
  getAllUsers,
  getAllUsersWithMetadata,
} from "../controllers/user.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/me", authenticate, getLoggedInUser);
router.get("/all", authenticate, getAllUsers);
router.get("/all/metadata", authenticate, getAllUsersWithMetadata);

export default router;
