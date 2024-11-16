import Router from "express";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controllers.js";

const router = Router();

router.post("/login", loginUser);

router.post("/register", registerUser);

router.post("/logout", logoutUser);

router.get("/users", getCurrentUser);

export default router;
