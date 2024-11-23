import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";

const verifyJWT = async (req, _, next) => {
  // get token from cookies
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(new ApiError(401, "Access Token not found"));
  }

  //   decode the token
  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken) {
      return next(new ApiError(401, "invalid token structure"));
    }

    // find the authorized user from docoded info
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return next(new ApiError(401, "Invalid Access Token"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(
      new ApiError(
        401,
        error?.message,
        null,
        [{ error }] || "Unauthorized request"
      )
    );
  }
};

export { verifyJWT };
