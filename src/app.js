import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalError } from "./middlewares/error.middleware.js";

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

// import routes
import userRouter from "./routes/user.route.js";

// routes;
app.use("/api/v1/user", userRouter);

// global error handler middleware
app.use(globalError);

export { app };
