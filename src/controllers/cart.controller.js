import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addToCart = asyncHandler(async (req, res) => {
  const { userId, productId, quantity } = req.body;
  if (!userId || !productId || quantity <= 0) {
    throw new ApiError(404, "Invalid data provided");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const findCurrentProductIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (findCurrentProductIndex === -1) {
    cart.items.push({ productId, quantity });
  } else {
    cart.items[findCurrentProductIndex].quantity += quantity;
  }

  await cart.save();

  res.status(200).json(new ApiResponse(200, cart, "Cart created successfully"));
});

const fetchCart = asyncHandler(async (req, res) => {});

export { addToCart, fetchCart };
