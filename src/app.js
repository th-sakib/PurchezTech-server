import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalError, notFound } from "./middlewares/error.middleware.js";

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
import userRouter from "./routes/user.route.js";

// import admin routes
import productRouter from "./routes/admin/product.route.js";

// routes;
app.use("/api/v1/user", userRouter);

// admin routes
app.use("/api/v1/admin/", productRouter);

// error handling middleware
app.use(notFound);
app.use(globalError);

export { app };
