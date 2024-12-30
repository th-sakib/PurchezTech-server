import { Router } from "express";
import {
  addToWishlist,
  deleteFromWishlist,
  fetchWishlist,
} from "../../controllers/wishlist.controller.js";

const router = Router();

router.post("/add-to-wishlist", addToWishlist);
router.get("/fetch-wishlist/:userId", fetchWishlist);
router.delete("/delete-wishlist", deleteFromWishlist);

export default router;
