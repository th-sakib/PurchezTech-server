class ApiError extends Error {
  constructor(
    statusCode = 500,
    message = "Something went wrong",
    data = null,
    errors = [],
    stack = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.errors = Array.isArray(errors) ? errors : [];
    this.success = false;
    // this.errors = errors;

    if (!stack) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = stack;
    }
  }
}

export { ApiError };
