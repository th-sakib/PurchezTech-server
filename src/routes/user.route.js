import Router from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateUserAccount,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = Router();

// routes (not secured)
router.post("/login", validate(loginSchema), loginUser);
router.post("/register", validate(registerSchema), registerUser);

// secured routes
router.post("/logout", verifyJWT, logoutUser);
router.get("/current-user", verifyJWT, getCurrentUser);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.post("/update-user-account", verifyJWT, updateUserAccount);
router.post("/refresh-token", refreshAccessToken);

export default router;
