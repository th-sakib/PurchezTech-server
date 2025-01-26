import { Coupon } from "../models/coupon.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCoupon = asyncHandler(async (req, res) => {
  const { coupon, couponQuantity, discount, durationInHours } = req.body;

  if (!coupon || !couponQuantity || !discount || !durationInHours) {
    throw new ApiError(400, "All fields are required");
  }

  const existingCoupon = await Coupon.findOne({ coupon });
  if (existingCoupon) {
    throw new ApiError(400, "coupon already exist");
  }

  let expiredAt = new Date();
  expiredAt.setHours(expiredAt.getHours() + durationInHours); // add hours with current hour

  const newlyCreatedCoupon = {
    coupon,
    couponQuantity,
    discount,
    expiredAt,
  };

  const coupons = new Coupon(newlyCreatedCoupon);
  await coupons.save();

  res
    .status(201)
    .json(new ApiResponse(201, coupons, "Coupon created successfully"));
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({});
  if (!coupons) {
    throw new ApiError(400, "No coupon found");
  }
  res
    .status(200)
    .json(new ApiResponse(200, { ...coupons }, "coupons fetched successfully"));
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupons = await Coupon.deleteOne({ _id: id });

  res
    .status(200)
    .json(new ApiResponse(200, coupons, "coupons deleted successfully"));
});

const useCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.params;

  const now = new Date();
  const validCoupon = await Coupon.findOne({
    coupon,
    expiredAt: { $gte: now },
    couponQuantity: { $gte: 1 },
  });

  if (!validCoupon || validCoupon?.couponQuantity < 1) {
    throw new ApiError(400, "Invalid or expired coupon");
  }

  validCoupon.couponQuantity -= 1;

  await validCoupon.save();

  res.status(200).json(new ApiResponse(200, validCoupon, "Coupon is correct"));
});

export { createCoupon, getAllCoupons, deleteCoupon, useCoupon };
