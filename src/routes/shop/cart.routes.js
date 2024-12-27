import { Router } from "express";
import {
  addToCart,
  deleteCartItem,
  fetchCart,
  updateCartItem,
} from "../../controllers/cart.controller.js";

const router = Router();

router.post("/add-to-cart", addToCart);
router.get("/get-cart/:userId", fetchCart);
router.put("/update-cart", updateCartItem);
router.delete("/delete-cart/:productId/:userId", deleteCartItem);

export default router;
