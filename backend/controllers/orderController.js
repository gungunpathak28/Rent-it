import Order from "../models/Order.js";

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id || req.user._id }).populate("itemId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching orders", error: error.message });
  }
};
