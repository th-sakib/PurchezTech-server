import { ApiError } from "../utils/ApiError.js";

const validate = (schema) => async (req, res, next) => {
  try {
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (err) {
    const message = err?.errors?.[0]?.message || "Invalid input";
    next(new ApiError(400, "Validation error", null, [{ message }]));
  }
};

export default validate;
