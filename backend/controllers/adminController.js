import User from "../models/User.js";
import Item from "../models/Item.js";
import Booking from "../models/Booking.js";

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching users" });
  }
};

// GET /api/admin/items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate("owner", "name email");
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching items" });
  }
};

// GET /api/admin/bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("item", "name")
      .populate("user", "name email");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching bookings" });
  }
};

// DELETE /api/admin/users/:id (Soft Delete)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // soft delete
    user.isActive = false;
    await user.save();

    res.json({ message: "User disabled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting user" });
  }
};

// DELETE /api/admin/items/:id (Soft Delete/Hide Item)
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Set available quantity to 0 to simulate removal from standard user search without breaking historical booking data maps
    item.availableQuantity = 0;
    // Alternatively, if you add a specific `isActive` flag for Items, you would flip it here.
    await item.save();

    res.json({ message: "Item safely hidden from catalog" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting item" });
  }
};
