import { Router } from "express";
import {
  cancelOrder,
  cancelPayment,
  createOrder,
  failPayment,
  fetchAllOrder,
  fetchCancelledOrder,
  fetchIndividualOrder,
  fetchOrder,
  successPayment,
  updateOrderStatus,
} from "../../controllers/order.controller.js";

const router = Router();

router.post("/create-order", createOrder);

router.get("/fetch-order/:userId", fetchOrder);
router.get("/fetch-individual-order/:orderId", fetchIndividualOrder);
router.get("/fetch-cancelled/:userId", fetchCancelledOrder);
router.get("/fetch-all-order", fetchAllOrder);
router.patch("/update-status", updateOrderStatus);
router.patch("/cancel-order/:orderId", cancelOrder);

// payment related routes
router.post("/success/:tranId", successPayment);
router.post("/fail/:tranId", failPayment);
router.post("/cancel/:tranId", cancelPayment);

export default router;
