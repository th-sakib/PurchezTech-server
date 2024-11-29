import Product from "../../models/product.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import uploadOnCloudinary from "../../utils/cloudinary.js";

// upload product functionality
const uploadProduct = asyncHandler(async (req, res) => {
  // converting buffer to base 64
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  const url = "data:" + req.file.mimetype + ";base64," + b64;

  const result = await uploadOnCloudinary(url);

  res
    .status(201)
    .json(new ApiResponse(201, { result }, "Image uploaded successfully"));
});

// create product
const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
    imageURL,
  } = req.body;

  // console.log(req.body);

  if (
    !title ||
    !description ||
    !category ||
    !brand ||
    !price ||
    !salePrice ||
    !totalStock ||
    !imageURL
  ) {
    throw new ApiError(400, "Missing required product fields");
  }

  const newlyCreatedProduct = new Product({
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
    imageURL,
  });

  if (!newlyCreatedProduct) {
    throw new ApiError(400, "Product creation failed");
  }

  await newlyCreatedProduct.save();

  res
    .status(201)
    .json(
      new ApiResponse(201, newlyCreatedProduct, "Product created successfully")
    );
});

// fetch product
const getAllProduct = asyncHandler(async (req, res) => {
  const listOfProduct = await Product.find({});

  if (!listOfProduct) {
    throw new ApiError(404, "Product not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, listOfProduct, "Product fetched successfully"));
});

// edit product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    category,
    brand,
    price,
    salePrice,
    totalStock,
    productImage,
  } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "The product not found");
  }

  product.title = title || product.title;
  product.description = description || product.description;
  product.category = category || product.category;
  product.brand = brand || product.brand;
  product.price = price || product.price;
  product.salePrice = salePrice || product.salePrice;
  product.totalStock = totalStock || product.totalStock;
  product.productImage = productImage || product.productImage;

  await product.save();

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  res.status(200).json(new ApiResponse(200, "Product deleted successfully"));
});

export {
  uploadProduct,
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
};
