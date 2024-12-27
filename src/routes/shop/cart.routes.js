import { Router } from "express";
import { addToCart, fetchCart } from "../../controllers/cart.controller.js";

const router = Router();

router.post("/add-to-cart", addToCart);
router.post("/get-cart", fetchCart);

export default router;
