import mongoose from "mongoose";

const couponSchema = mongoose.Schema(
  {
    coupon: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    couponQuantity: {
      type: Number,
      required: true,
      default: 1,
    },
    discount: {
      type: Number,
      required: true,
      default: 1,
    },
    expiredAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const Coupon =
  mongoose.models.coupons || mongoose.model("Coupon", couponSchema);
