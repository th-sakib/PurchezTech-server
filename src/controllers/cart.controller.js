import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addToCart = asyncHandler(async (req, res) => {
  const { userId, productId, quantity } = req.body;

  if (!userId) {
    throw new ApiError(404, "UserId not found");
  }
  if (!productId) {
    throw new ApiError(404, "productId not found");
  }
  if (!quantity) {
    throw new ApiError(404, "quantity not found");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // checking the stock
  if (quantity > product.totalStock) {
    throw new ApiError(400, "Product is out of stock");
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  // check if the product is in the cart
  const findCurrentProductIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (findCurrentProductIndex === -1) {
    cart.items.push({ productId, quantity });
  } else {
    const newQuantity = (cart.items[findCurrentProductIndex].quantity +=
      quantity); // storing new updated quantity for checking available stock
    if (newQuantity > product.totalStock) {
      throw new ApiError(400, "Product is out of stock");
    }
    cart.items[findCurrentProductIndex].quantity = newQuantity; // saving the quantity in the cart
  }

  await cart.save();

  res.status(200).json(new ApiResponse(200, cart, "Cart created successfully"));
});

const fetchCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(404, "UserId is required");
  }

  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "imageURL title price salePrice totalStock",
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const validItems = cart.items.filter((productItem) => productItem.productId);

  if (validItems.length < cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }

  const populateCartItems = validItems.map((item) => ({
    productId: item.productId._id,
    image: item.productId.imageURL,
    title: item.productId.title,
    price: item.productId.price,
    salePrice: item.productId.salePrice,
    maxStock: item.productId.totalStock,
    quantity: item.quantity,
  }));

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...cart._doc, items: populateCartItems },
        "Cart fetched successfully"
      )
    );
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, userId, quantity } = req.body;

  if ((!productId, !userId, quantity <= 0)) {
    throw new ApiError(404, "Invalid data provided");
  }

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(400, "Product not found");
  }

  if (quantity > product.totalStock) {
    throw new ApiError(400, "Product is out of stock");
  }

  const findCurrentProductIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (findCurrentProductIndex === -1) {
    throw new ApiError(404, "Cart item not found");
  }

  if (cart.items[findCurrentProductIndex].quantity !== quantity) {
    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();
  }

  await cart.populate({
    path: "items.productId",
    select: "imageURL title price salePrice totalStock",
  });

  const populateCartItems = cart.items.map((item) => ({
    productId: item.productId ? item.productId._id : null,
    image: item.productId ? item.productId.imageURL : null,
    price: item.productId ? item.productId.price : null,
    salePrice: item.productId ? item.productId.salePrice : null,
    maxStock: item.productId ? item.productId.totalStock : null,
    quantity: item.quantity,
  }));

  res
    .status(200)
    .json(new ApiResponse(200, { ...cart._doc, items: populateCartItems }));
});

const deleteCartItem = asyncHandler(async (req, res) => {
  const { userId, productId } = req.params;

  if (!userId || !productId) {
    throw new ApiError(404, "Invalid data provided");
  }

  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "imageURL title price salePrice totalStock",
  });

  const findCurrentProductIndex = cart.items.findIndex(
    (item) => item.productId._id.toString() === productId
  );

  if (findCurrentProductIndex === -1) {
    throw new ApiError(404, "Cart item not found");
  }

  const initialItemsCount = cart.items.length;
  cart.items = cart.items.filter(
    (item) => item.productId && item.productId._id.toString() !== productId
  );

  if (initialItemsCount > cart.items.length) {
    await cart.save();
  } else {
    throw new ApiError(500, "cart item deletion failed");
  }

  res.status(200).json(new ApiResponse(200, { ...cart._doc }));
});

export { addToCart, fetchCart, updateCartItem, deleteCartItem };
