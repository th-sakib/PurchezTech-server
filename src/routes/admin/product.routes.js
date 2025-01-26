import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import {
  createProduct,
  deleteCloudProduct,
  deleteProduct,
  updateProduct,
  uploadProduct,
} from "../../controllers/admin/product.controller.js";
import isAdmin from "../../middlewares/admin.middleware.js";

const router = Router();

// upload product image
router.post(
  "/upload-product",
  verifyJWT,
  isAdmin,
  upload.single("productImage"),
  uploadProduct
);

router.post("/create-product", verifyJWT, isAdmin, createProduct);
router.put("/update-product/:id", verifyJWT, isAdmin, updateProduct);
router.delete("/delete-product/:id", verifyJWT, isAdmin, deleteProduct);
router.delete("/delete-cloud-product", verifyJWT, isAdmin, deleteCloudProduct);

export default router;
