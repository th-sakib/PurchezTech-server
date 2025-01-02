import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { sslInit } from "../utils/sslCommerz.js";
import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";

const createOrder = asyncHandler(async (req, res) => {
  const {
    address,
    city,
    country,
    fullName,
    phone,
    postalCode,
    totalAmount,
    userId,
    cartItems,
  } = req.body;

  if (!req.body) {
    throw new ApiError(400, "Provide data");
  }

  const tranID = new mongoose.Types.ObjectId().toString();

  const data = {
    total_amount: totalAmount,
    currency: "BDT",
    tran_id: tranID, // use unique tran_id for each api call
    success_url: `http://localhost:5000/api/v1/shop/success/${tranID}`,
    fail_url: `http://localhost:5000/api/v1/shop/fail/${tranID}`,
    cancel_url: `http://localhost:5000/api/v1/shop/cancel/${tranID}`,
    ipn_url: "http://localhost:5000/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: fullName,
    cus_email: "customer@example.com",
    cus_add1: address,
    cus_add2: "Dhaka",
    cus_city: city,
    cus_state: "Dhaka",
    cus_postcode: postalCode,
    cus_country: country,
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: postalCode,
    ship_country: "Bangladesh",
  };

  // getting products from cart
  let orderItems = [];

  if (cartItems && cartItems?.length > 0) {
    cartItems.forEach((item) => {
      const newProduct = {
        product: item.productId, // Reference the product ID
        name: item.title, // Product title
        quantity: item.quantity, // Quantity ordered
        price: item.salePrice, // Sale price at checkout
        image: item.image, // Product image URL
      };
      orderItems.push(newProduct);
    });
  } else {
    console.log("Cart Items are empty or not provided");
  }

  const sslResponse = await sslInit(data);
  const url = sslResponse.GatewayPageURL;

  const order = new Order({
    user: userId,
    orderItems,
    addressInfo: {
      fullName,
      address,
      city,
      country,
      phone,
      postalCode,
    },
    paymentDetails: {
      tranID,
    },
    totalPrice: totalAmount,
  });

  await order.save();

  res.status(200).json(new ApiResponse(200, { url }, "Order has been placed"));
});

const successPayment = asyncHandler(async (req, res) => {
  const { tranId } = req.params;
  const { card_brand, bank_tran_id, card_issuer, tran_date } = req.body;

  const order = await Order.findOne({ "paymentDetails.tranID": tranId });

  order.paymentDetails.cardBrand = card_brand;
  order.paymentDetails.bankTranId = bank_tran_id;
  order.paymentDetails.cardIssuer = card_issuer;
  order.paymentDetails.tranDate = tran_date;
  order.paymentDetails.status = "paid";

  await order.save();
  await Cart.deleteOne({ userId: order.user });

  res.redirect("http://localhost:5173/payment/success");
});

const failPayment = asyncHandler(async (req, res) => {
  const { tranId } = req.params;

  await Order.deleteOne({ "paymentDetails.tranID": tranId });

  res.redirect("http://localhost:5173/payment/fails");
});

const cancelPayment = asyncHandler(async (req, res) => {
  const { tranId } = req.params;

  await Order.deleteOne({ "paymentDetails.tranID": tranId });

  res.redirect("http://localhost:5173/payment/cancel");
});

const fetchOrder = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "userId is required");
  }

  const order = await Order.find({ user: userId });
  // console.log(order);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { order }, "Order list successfully fetched"));
});

const fetchAllOrder = asyncHandler(async (req, res) => {
  const order = await Order.find();
  // console.log(order);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { order }, "Order list successfully fetched"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { userId, status } = req.body;

  if (!userId) {
    throw new ApiError(400, "userId is required");
  }

  const order = await Order.findOne({ user: userId });

  order.orderStatus = status;

  await order.save();

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Order status updated successfully"));
});

export {
  createOrder,
  successPayment,
  failPayment,
  cancelPayment,
  fetchOrder,
  fetchAllOrder,
  updateOrderStatus,
};
