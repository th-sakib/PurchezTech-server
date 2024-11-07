import Router from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../controllers/user.controllers.js";

const router = Router();

router.post("/login", loginUser);

router.post("/register", registerUser);

router.get("/users", getCurrentUser);
