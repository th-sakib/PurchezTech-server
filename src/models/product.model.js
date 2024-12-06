import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      lowercase: true,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    salePrice: {
      type: Number,
      default: 0,
      required: [false, "Sale price is required"],
    },
    totalStock: {
      type: Number,
      required: [true, "Stock is required"],
    },
    imageURL: {
      type: String,
      required: [true, "Product image is must be provided"],
    },
    publicID: {
      type: String,
      required: [true, "Public Id is required"],
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
