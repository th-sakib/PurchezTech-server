import Router from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUserAccount,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// routes (not secured)
router.post("/login", loginUser);
router.post("/register", registerUser);

// secured routes
router.post("/logout", verifyJWT, logoutUser);
router.get("/current-user", verifyJWT, getCurrentUser);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.post("/update-user-account", verifyJWT, updateUserAccount);

export default router;
