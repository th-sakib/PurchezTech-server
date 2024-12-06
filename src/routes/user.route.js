import { Router } from "express";
import {
  authenticityCheck,
  changeCurrentPassword,
  getCurrentUser,
  googleLogin,
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

router.get("/get", (req, res) => {
  res.send("hehehe");
});

// routes (not secured)
router.post("/login", validate(loginSchema), loginUser);
router.post("/register", validate(registerSchema), registerUser);
router.post("/google-login", googleLogin);

// secured routes
router.get("/authenticity", verifyJWT, authenticityCheck);
router.post("/logout", verifyJWT, logoutUser);
router.get("/current-user", verifyJWT, getCurrentUser);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.post("/update-user-account", verifyJWT, updateUserAccount);
router.post("/refresh-token", refreshAccessToken);

export default router;
