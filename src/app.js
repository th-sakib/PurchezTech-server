import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalError, notFound } from "./middlewares/error.middleware.js";

import {
  getAllProduct,
  getPopularProduct,
  getProduct,
} from "./controllers/admin/product.controller.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});

// import routes
import userRouter from "./routes/user.routes.js";
import cartRouter from "./routes/shop/cart.routes.js";
import wishlistRouter from "./routes/shop/wishlist.routes.js";
import orderRouter from "./routes/shop/order.routes.js";

// import admin routes
import productRouter from "./routes/admin/product.routes.js";
import CouponRouter from "./routes/coupon.routes.js";
import dashboardRouter from "./routes/admin/dashboard.routes.js";

// routes;
app.use("/api/v1/user", userRouter);

// admin routes
app.use("/api/v1/admin/", productRouter);
app.use("/api/v1/admin/", dashboardRouter);

// shop related routes
app.use("/api/v1/shop/", cartRouter);
app.use("/api/v1/shop/", wishlistRouter);
app.use("/api/v1/shop/", orderRouter);

// coupons
app.use("/api/v1/coupon/", CouponRouter);

// for getting all product - logged out user
app.use("/api/v1/get-products", getAllProduct);
app.use("/api/v1/get-popular", getPopularProduct); // updates
app.use("/api/v1/get-product/:id", getProduct);

// error handling middleware
app.use(notFound);
app.use(globalError);

export { app };
