import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import uploadOnCloudinary from "../../utils/cloudinary.js";

const handleUploadProduct = asyncHandler(async (req, res) => {
  // converting buffer to base 64
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  const url = "data:" + req.file.mimetype + ";base64," + b64;

  const result = await uploadOnCloudinary(url);

  res
    .status(200)
    .json(new ApiResponse(200, { result }, "Image uploaded successfully"));
});

export { handleUploadProduct };
