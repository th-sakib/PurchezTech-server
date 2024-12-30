import Product from "../models/product.model.js";
import Wishlist from "../models/wishlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addToWishlist = asyncHandler(async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    throw new ApiError(400, "Invalid provided data");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product doesn't exist");
  }

  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = new Wishlist({ userId, list: [] });
  }

  // check if the product is in the wishlist
  const findCurrentProductIndex = wishlist.list.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (findCurrentProductIndex === -1) {
    wishlist.list.push({ productId: productId });
  } else {
    throw new ApiError(400, "Product already exist in wishlist");
  }

  await wishlist.save();

  res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Added to Wishlist successfully"));
});

const fetchWishlist = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "userId is required");
  }

  const wishlist = await Wishlist.findOne({ userId }).populate({
    path: "list.productId",
    select: "imageURL title price salePrice",
  });

  if (!wishlist) {
    throw new ApiError(404, "wishlist not found");
  }

  const validItems = wishlist.list.filter((item) => item.productId);

  if (validItems.length < wishlist.list.length) {
    wishlist.list = validItems;
    await wishlist.save();
  }

  const populatedWishlistItems = validItems.map((item) => ({
    productId: item.productId._id,
    image: item.productId.imageURL,
    title: item.productId.title,
    price: item.productId.price,
    salePrice: item.productId.salePrice,
  }));

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...wishlist._doc, list: populatedWishlistItems },
        "Wishlist fetched successfully"
      )
    );
});

const deleteFromWishlist = asyncHandler(async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    throw new ApiError(400, "Invalid provided data");
  }

  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    throw new ApiError(404, "Wishlist not found");
  }

  // check if the product is in the wishlist
  const findCurrentProductIndex = wishlist.list.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (findCurrentProductIndex === -1) {
    throw new ApiError(400, "Product not found");
  }

  // filtering out the product
  const updatedList = wishlist.list.filter(
    (item) => item.productId.toString() !== productId
  );
  wishlist.list = updatedList;

  await wishlist.save();

  res.status(200).json(new ApiResponse(200, "Product deleted successfully"));
});

export { addToWishlist, fetchWishlist, deleteFromWishlist };
