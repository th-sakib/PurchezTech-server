import { Router } from "express";
import {
  cancelPayment,
  createOrder,
  failPayment,
  fetchAllOrder,
  fetchOrder,
  successPayment,
  updateOrderStatus,
} from "../../controllers/order.controller.js";

const router = Router();

router.post("/create-order", createOrder);

router.get("/fetch-order/:userId", fetchOrder);
router.get("/fetch-all-order", fetchAllOrder);
router.patch("/update-status", updateOrderStatus);

// payment related routes
router.post("/success/:tranId", successPayment);
router.post("/fail/:tranId", failPayment);
router.post("/cancel/:tranId", cancelPayment);

export default router;
