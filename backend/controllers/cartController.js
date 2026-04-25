import Cart from "../models/Cart.js";
import Item from "../models/Item.js";

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id || req.user._id })
      .populate("items.itemId");
    
    if (!cart) {
      // Return empty cart mapping
      return res.json({ items: [] });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/cart/add
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "Item ID required" });
    }

    let cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      cart = new Cart({
        userId: userId,
        items: []
      });
    }

    const itemIndex = cart.items.findIndex(i => i.itemId.toString() === itemId.toString());
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({
        itemId: itemId,
        quantity: 1
      });
    }

    await cart.save();

    res.status(200).json({ success: true, message: "Added to cart" });
  } catch (err) {
    console.error("CART ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/cart/remove
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body; // or req.params.itemId based on standard convention, but user prompt implied generic remove endpoint

    const cart = await Cart.findOne({ userId: req.user.id || req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(i => i.itemId.toString() !== itemId);
    await cart.save();

    const populatedCart = await cart.populate("items.itemId");
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: "Server error removing from cart" });
  }
};
