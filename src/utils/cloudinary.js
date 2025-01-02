import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./ApiError.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (file, folder = "purchezTech") => {
  try {
    if (!file) return null;

    const res = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      folder: folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
    });

    return res;
  } catch (error) {
    throw new ApiError(501, "Uploading in cloudinary problem", [error]);
  }
};

const deleteFromCloudinary = async (publicID) => {
  try {
    if (!publicID) return null;

    const res = await cloudinary.uploader.destroy(publicID);

    return res;
  } catch (error) {
    throw new ApiError(501, "Cloud deletion failed");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
