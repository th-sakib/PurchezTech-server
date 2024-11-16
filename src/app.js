import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

function fetchData() {
  throw new ApiError(400, "something went wrong custom error is here.");
}
try {
  fetchData();
} catch (err) {
  console.error(err.stack);
}

// import routes
import userRouter from "./routes/user.route.js";
import { ApiError } from "./utils/ApiError.js";
// routes;
app.use("/api/v1/user", userRouter);

export { app };
