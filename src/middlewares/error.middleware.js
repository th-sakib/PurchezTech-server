import { ApiError } from "../utils/ApiError.js";

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const globalError = (err, req, res, next) => {
  if (err instanceof ApiError) {
    // Handle custom `ApiError`
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: null,
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

// const globalError = (err, req, res, next) => {
//   let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   let message = err.message;

//   // If Mongoose not found error, set to 404 and change message
//   if (err.name === "CastError" && err.kind === "ObjectId") {
//     statusCode = 404;
//     message = "Resource not found";
//   }

//   res.status(statusCode).json({
//     message: message,
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   });
// };
