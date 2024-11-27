import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (file) => {
  try {
    if (!file) return null;
    // console.log(file);

    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      folder: "purchezTech/products",
    });

    return res;
  } catch (error) {
    throw new ApiError(501, "Uploading in cloudinary problem", [error]);
    return null;
  }
};

export default uploadOnCloudinary;
