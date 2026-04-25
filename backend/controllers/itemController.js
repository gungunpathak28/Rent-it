import Item from "../models/Item.js";
import Booking from "../models/Booking.js";

export const getAllItems = async (req, res) => {
  try {
    const { location, category, maxPrice, search, sort } = req.query;

    let filter = {};

    if (location) {
      filter.location = { $regex: `^${location}$`, $options: "i" };
    }

    if (category) filter.category = category;
    if (maxPrice) filter.pricePerDay = { $lte: Number(maxPrice) };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    let sortOption = sort === "trending" ? { bookingCount: -1 } : { createdAt: -1 };

    let items = await Item.find(filter)
      .populate("ownerId", "name email phoneNumber")
      .sort(sortOption);

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("ownerId", "name email phoneNumber");

    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createItem = async (req, res) => {
try {
const itemData = { ...req.body };
if (req.user && req.user._id) {
  itemData.ownerId = req.user._id;
}
const item = await Item.create(itemData);
res.status(201).json(item);
} catch (err) {
res.status(500).json({ message: err.message });
}
};

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (item.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ ownerId: req.user._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getRecommendedItems = async (req, res) => {
  try {
    const { itemId } = req.query;
    
    // Scenario 1: Related Item Recommendation
    if (itemId) {
      const item = await Item.findById(itemId);
      if (item) {
        const related = await Item.find({
          _id: { $ne: itemId },
          category: item.category,
          availableQuantity: { $gt: 0 }
        }).limit(4);
        return res.json({ type: "related", items: related });
      }
    }

    // Scenario 2: Historical/Personalized Recommendation
    if (req.user) {
      const pastBookings = await Booking.find({ user: req.user._id })
        .populate("item")
        .sort("-createdAt")
        .limit(10);
      
      if (pastBookings.length > 0) {
        const categories = [...new Set(pastBookings.map(b => b.item?.category).filter(Boolean))];
        const recommended = await Item.find({
          category: { $in: categories },
          availableQuantity: { $gt: 0 }
        }).limit(6);
        
        if (recommended.length > 0) {
          return res.json({ type: "personalized", items: recommended });
        }
      }
    }

    // Scenario 3: Fallback - Top Rated Picks
    const topRated = await Item.find({ availableQuantity: { $gt: 0 } })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(6);
    
    res.json({ type: "top-rated", items: topRated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
