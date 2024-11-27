import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { handleUploadProduct } from "../../controllers/admin/product.controller.js";

const router = Router();

router.post(
  "/upload-product",
  verifyJWT,
  upload.single("productImage"),
  handleUploadProduct
);

export default router;
