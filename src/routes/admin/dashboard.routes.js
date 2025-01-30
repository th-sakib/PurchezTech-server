import { Router } from "express";
import {
  getCategoryStats,
  getStats,
} from "../../controllers/admin/dashboard.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import isAdmin from "../../middlewares/admin.middleware.js";

const router = Router();

router.get("/stats", verifyJWT, isAdmin, getStats);
router.get("/category-states", verifyJWT, isAdmin, getCategoryStats);

export default router;
