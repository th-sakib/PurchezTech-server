import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import User from "../models/user.model";
b;

const verifyJWT = async (req, res, next) => {
  // get token from cookies
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    //   decode the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // find the authorized user from docoded info
    const user = await User.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Verification failed! Invalid Access Token"
    );
  }
};
