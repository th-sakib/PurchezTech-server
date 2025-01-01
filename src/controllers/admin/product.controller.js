import Product from "../../models/product.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../../utils/cloudinary.js";

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
    publicID,
  } = req.body;

  // console.log(req.body);

  if (!title) {
    throw new ApiError(400, "Title is required");
  }
  if (!description) {
    throw new ApiError(400, "Description is required");
  }
  if (!category) {
    throw new ApiError(400, "category is required");
  }
  if (!brand) {
    throw new ApiError(400, "brand is required");
  }
  if (!price) {
    throw new ApiError(400, "price is required");
  }
  if (!salePrice) {
    throw new ApiError(400, "salePrice is required");
  }
  if (!imageURL) {
    throw new ApiError(400, "imageURL is required");
  }
  if (!publicID) {
    throw new ApiError(400, "Public id is required");
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
    publicID,
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

// upload product functionality
const uploadProduct = asyncHandler(async (req, res) => {
  // converting buffer to base 64
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  const url = "data:" + req.file.mimetype + ";base64," + b64;

  const result = await uploadOnCloudinary(url, "purchezTech/products");

  res
    .status(201)
    .json(new ApiResponse(201, result, "Image uploaded successfully"));
});

// delete from cloudinary
const deleteCloudProduct = asyncHandler(async (req, res) => {
  const { publicID } = req.body;

  if (!publicID) {
    throw new ApiError(400, "Product Id is required to perform delete");
  }

  const result = await deleteFromCloudinary(publicID);

  res
    .status(200)
    .json(new ApiResponse(200, result, "Product is deleted from cloud"));
});

// fetch product
const getAllProduct = asyncHandler(async (req, res) => {
  const {
    category,
    brand,
    sortByPrice,
    sortByDate,
    search,
    minPrice,
    maxPrice,
    page = 1,
    limit = 12,
  } = req.query;

  // filtering by category | brand
  const query = {};
  if (category && category !== "default") query.category = category;
  if (brand && category !== "default") query.brand = brand;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // filter by price range
  if (minPrice)
    query.salePrice = { ...query.salePrice, $gte: Number(minPrice) };
  if (maxPrice)
    query.salePrice = { ...query.salePrice, $lte: Number(maxPrice) };

  // sorting by price | date
  const sortBy = {};
  if (sortByPrice === "asc") sortBy.salePrice = 1; // lowest first
  if (sortByPrice === "desc") sortBy.salePrice = -1; // highest first
  if (sortByDate === "asc") sortBy.createdAt = 1; // oldest first
  if (sortByDate === "desc") sortBy.createdAt = -1; // newest first

  const categoryQueryForPriceRange = {};
  if (category && category !== "default")
    categoryQueryForPriceRange.category = category;

  const priceAggregation = await Product.aggregate([
    { $match: categoryQueryForPriceRange },
    {
      $group: {
        _id: null,
        initialMinPrice: { $min: "$salePrice" },
        initialMaxPrice: { $max: "$salePrice" },
      },
    },
  ]);
  const priceRange = priceAggregation[0] || { minPrice: 0, maxPrice: 1000 };

  // pagination
  const skip = (page - 1) * limit;

  const listOfProduct = await Product.find(query)
    .sort(sortBy)
    .skip(skip)
    .limit(Number(limit));
  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / limit);

  if (!listOfProduct) {
    throw new ApiError(404, "Product not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { listOfProduct, priceRange, totalProducts, totalPages },
        "Product fetched successfully"
      )
    );
});

// get product by id
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Product id is required");
  }

  const product = await Product.findById(id);

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

// edit product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, category, brand, price, salePrice, totalStock } =
    req.body;

  if (!req.body) {
    throw new ApiError(400, "All field is required");
  }

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
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  deleteCloudProduct,
};
