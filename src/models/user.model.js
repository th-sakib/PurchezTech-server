import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows null value
    },
    avatar: {
      type: String,
      default: null,
    },
    avatarPublicId: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // this indexing can help to find this data more faster
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // if googleId exists it become false otherwise reverse the logic
      },
    },
    role: {
      type: String,
      default: "customer",
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// hashing pass before saving to db
userSchema.pre("save", async function (next) {
  if (!this.password === "ggl" || !this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// checking password validation by comparing
userSchema.methods.isPassCorrect = async function (enteredPass) {
  return await bcrypt.compare(enteredPass, this.password);
};

// methods to generate access and refresh token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET || "fallbackAccessToken",
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET || "fallbackRefreshToken",
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    }
  );
};

export const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
