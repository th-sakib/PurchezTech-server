import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage"
);

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "user not found while generating access token");
    }

    // generate access and refresh token
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // save refresh token in db
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(500, "Error generating access and refresh tokens.");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // taking data from frontend
  const { fullName, email, username, password } = req.body;

  // check if data are not empty
  if (!email) {
    throw new ApiError(400, "email is required");
  }

  if (!username) {
    throw new ApiError(400, "username is required!");
  }

  if (!fullName) {
    throw new ApiError(400, "fullname is required");
  }
  if (!password) {
    throw new ApiError(400, "pass is required");
  }

  //check if username or email already exists
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "Username or Email already exists");
  }

  // create new user to database
  const user = new User({
    fullName,
    email,
    password,
    username,
  });

  await user.save();

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Error during user registration");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { usernameOREmail, password } = req.body;

  if (!usernameOREmail) {
    throw new ApiError(400, "username or email required!");
  }

  if (!password) {
    throw new ApiError(400, "password is required!");
  }

  // find the user in db
  const user = await User.findOne({
    $or: [{ username: usernameOREmail }, { email: usernameOREmail }],
  });

  if (!user) {
    throw new ApiError(404, "User not exists");
  }

  const isPasswordValid = await user?.isPassCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user?._id
  );

  const loggedInUser = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure only in production
    sameSite: "Strict", // CSRF protection
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, { loggedInUser }, "User logged in successfully")
    );
});

const googleLogin = asyncHandler(async (req, res) => {
  const { code } = req.body; // the authorization code

  if (!code) {
    throw new ApiError(400, "Authorization code is missing");
  }

  const { tokens } = await googleClient.getToken(code);

  if (!tokens) {
    throw new ApiError(500, "Failed to exchange code to get tokens");
  }

  const idToken = tokens.id_token;

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  if (!ticket) {
    throw new ApiError(500, "Token verification failed");
  }

  const payload = ticket.getPayload();

  const { picture: avatar, name: fullName, sub: googleId, email } = payload;

  let user = await User.findOne({ googleId });
  if (!user) {
    user = await User.create({
      fullName,
      googleId,
      avatar,
      email,
      username: email.split("@")[0],
      password: "ggl",
    });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user?._id
  );

  user.refreshToken = refreshToken;

  await user.save();

  const googleLoggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure only in production
    sameSite: "Strict", // CSRF protection
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, { googleLoggedUser }, "Google Login successful")
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "Strict",
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request: Refresh token missing");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
      throw new ApiError(401, "Invalid refresh token: User not found");
    }

    // console.log(user);

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(
        401,
        "Invalid refresh token: Token mismatch or expired"
      );
    }

    const userInfo = {
      _id: user?._id,
      email: user?.email,
      username: user?.username,
      fullName: user?.fullName,
      role: user?.role,
    };
    // console.log(userInfo);

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user?._id);

    const options = {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "Strict",
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken, userInfo },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token: Verification failed");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    fullName: req.user.fullName,
    role: req.user.role,
  }; // req.user is coming from the auth middleware

  res
    .status(200)
    .json(new ApiResponse(200, user, "User info fetched successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id).select("-refreshToken");

  if (!user) {
    throw new ApiError(400, "User not found: while changing password");
  }

  const isPassCorrect = await user.isPassCorrect(oldPassword);

  if (!isPassCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json(new ApiResponse(200, "Password changed successfully"));
});

const updateUserAccount = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const authenticityCheck = asyncHandler(async (req, res) => {
  const isUser = Boolean(req.user);
  if (!isUser) {
    throw new ApiError(401, "Unauthenticated");
  }

  res.status(200).json(new ApiResponse(200, "Authenticated"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  //TODO: implement file storing mechanism
});

const updateUserCoverPhoto = asyncHandler(async (req, res) => {
  //TODO: implement file storing mechanism
});

export {
  registerUser,
  loginUser,
  googleLogin,
  refreshAccessToken,
  logoutUser,
  getCurrentUser,
  changeCurrentPassword,
  updateUserAccount,
  updateUserAvatar,
  updateUserCoverPhoto,
  authenticityCheck,
};
