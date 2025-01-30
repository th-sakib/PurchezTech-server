import { Router } from "express";
import {
  authenticityCheck,
  changeCurrentPassword,
  getAllUsers,
  getCurrentUser,
  googleLogin,
  loginUser,
  logoutUser,
  makeAdmin,
  refreshAccessToken,
  registerUser,
  updateUserAccount,
  uploadAvatar,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { upload } from "../middlewares/multer.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = Router();

// routes (not secured)
router.post("/login", validate(loginSchema), loginUser);
router.post("/register", validate(registerSchema), registerUser);
router.post("/google-login", googleLogin);
router.post("/refresh-token", refreshAccessToken);

// secured routes
router.get("/authenticity", verifyJWT, authenticityCheck);
router.post("/logout", verifyJWT, logoutUser);
router.get("/current-user", verifyJWT, getCurrentUser);
router.get("/all-user", verifyJWT, getAllUsers);
router.patch("/change-password", verifyJWT, changeCurrentPassword);
router.patch("/update-user-account", verifyJWT, updateUserAccount);
router.patch(
  "/upload-avatar",
  verifyJWT,
  upload.single("avatar"),
  uploadAvatar
);
router.patch("/make-admin", verifyJWT, isAdmin, makeAdmin);

export default router;
