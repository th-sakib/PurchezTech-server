import { ApiError } from "../utils/ApiError.js";

const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

const globalError = (err, req, res, next) => {
  if (err instanceof ApiError) {
    // Handle custom `ApiError`
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: err.data,
      errors: err.errors,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  }

  // Handle unexpected errors
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    data: null,
    errors: [],
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, globalError };
