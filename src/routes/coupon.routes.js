import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  useCoupon,
} from "../controllers/coupon.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/admin.middleware.js";

const router = Router();

router.post("/create", verifyJWT, isAdmin, createCoupon);
router.get("/", verifyJWT, isAdmin, getAllCoupons);
router.delete("/:id", verifyJWT, isAdmin, deleteCoupon);
router.get("/use/:coupon", verifyJWT, useCoupon);

export default router;
