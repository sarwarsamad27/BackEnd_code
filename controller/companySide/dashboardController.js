const Order = require("../../models/userSide/orderModel");
const ProductDetail = require("../../models/companySide/productDetailModel");
const mongoose = require("mongoose");

exports.getCompanyDashboard = async (req, res) => {
  try {
    const companyId = req.user.id; // company token se aaega
    const { type } = req.query; // daily | weekly | monthly

    // 1️⃣ Total Products
    const totalProducts = await ProductDetail.countDocuments({ company: companyId });

    // 2️⃣ Total Orders
    const companyProductIds = await ProductDetail.find({ company: companyId }).distinct("_id");
    const totalOrders = await Order.countDocuments({
      "products.product": { $in: companyProductIds }
    });

    // 3️⃣ Total Revenue
    const deliveredOrders = await Order.aggregate([
      { $match: { status: { $in: ["Delivered", "Received"] } } },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "productdetails",
          localField: "products.product",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      { $match: { "productInfo.company": new mongoose.Types.ObjectId(companyId) } },
      {
        $group: {
          _id: null,
          revenue: { $sum: { $multiply: ["$products.quantity", "$productInfo.price"] } }
        }
      }
    ]);
    const totalRevenue = deliveredOrders.length > 0 ? deliveredOrders[0].revenue : 0;

    // 4️⃣ Pending Orders
    const pendingOrders = await Order.countDocuments({
      status: { $in: ["For Verify", "Verified"] },
      "products.product": { $in: companyProductIds }
    });

    // 5️⃣ Chart Data (Dynamic)
    let groupStage;
    if (type === "daily") {
      groupStage = {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        }
      };
    } else if (type === "weekly") {
      groupStage = {
        _id: {
          week: { $week: "$createdAt" },
          year: { $year: "$createdAt" }
        }
      };
    } else {
      // default monthly
      groupStage = {
        _id: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        }
      };
    }

    const salesData = await Order.aggregate([
      { $match: { status: { $in: ["Delivered", "Received"] } } },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "productdetails",
          localField: "products.product",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      { $match: { "productInfo.company": new mongoose.Types.ObjectId(companyId) } },
      { $group: { ...groupStage, revenue: { $sum: { $multiply: ["$products.quantity", "$productInfo.price"] } }, orders: { $sum: 1 } } },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      salesData
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
