import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  updateProduct,
  uploadProduct,
} from "../../controllers/admin/product.controller.js";

const router = Router();

// upload product image
router.post(
  "/upload-product",
  verifyJWT,
  upload.single("productImage"),
  uploadProduct
);

router.post("/create-product", verifyJWT, createProduct);
router.put("/update-product/:id", verifyJWT, updateProduct);
router.post("/delete-product/:id", verifyJWT, deleteProduct);

router.get("/get-product", verifyJWT, getAllProduct);

export default router;
