import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import User from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const getStats = asyncHandler(async (_, res) => {
  const totalProduct = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  // const totalSoldItem = await Order.aggregate([
  //   { $unwind: "$orderItems" },
  //   { $count: "totalSoldItem" },
  // ]);
  const totalSoldItemResult = await Order.aggregate([
    {
      $match: {
        orderStatus: { $nin: ["Cancelled"] },
        "paymentDetails.status": "paid",
      },
    },
    {
      $unwind: "$orderItems",
    },
    {
      $group: {
        _id: null,
        totalSoldItem: { $sum: "$orderItems.quantity" },
      },
    },
  ]);
  const totalSoldItem = totalSoldItemResult[0].totalSoldItem || 0;

  const totalUsers = await User.countDocuments();

  const totalSalesResult = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  const totalSales = totalSalesResult[0].totalSales || 0;

  const totalCompletedOrder = await Order.countDocuments({
    orderStatus: "Completed",
  });

  const stats = {
    totalProduct,
    totalOrders,
    totalSoldItem,
    totalUsers,
    totalSales,
    totalCompletedOrder,
  };

  res
    .status(200)
    .json(new ApiResponse(200, stats, "Stats are fetched succesfully"));
});

const getCategoryStats = asyncHandler(async (_, res) => {
  const categoryWiseStats = await Order.aggregate([
    {
      $match: {
        orderStatus: { $nin: ["Cancelled"] },
        "paymentDetails.status": "paid",
      },
    },
    {
      $unwind: "$orderItems",
    },
    {
      $lookup: {
        from: "products",
        localField: "orderItems.product",
        foreignField: "_id",
        as: "product",
        pipeline: [{ $project: { category: 1 } }],
      },
    },
    {
      $unwind: "$product",
    },
    {
      $group: {
        _id: "$product.category",
        countProduct: { $sum: "$orderItems.quantity" },
      },
    },
  ]);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        categoryWiseStats,
        "Category wise stats are appeared"
      )
    );
});

export { getStats, getCategoryStats };
