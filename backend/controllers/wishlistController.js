import User from "../models/User.js";

export const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id || req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Initialize wishlist array if undefined
    if (!user.wishlist) {
      user.wishlist = [];
    }

    const itemId = req.params.itemId;
    const exists = user.wishlist.includes(itemId);

    if (exists) {
      user.wishlist.pull(itemId);
    } else {
      user.wishlist.push(itemId);
    }

    await user.save();
    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id || req.user._id).populate("wishlist");
    if (!user) return res.status(404).json({ message: "User not found" });
    
    res.json(user.wishlist || []);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
