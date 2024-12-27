import { Router } from "express";
import { addToCart, fetchCart } from "../../controllers/cart.controller.js";

const router = Router();

router.post("/add-to-cart", addToCart);
router.get("/get-cart/:userId", fetchCart);

export default router;
