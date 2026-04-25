import Item from "../models/Item.js";

export const getBotResponse = async (req, res) => {
  try {
    const { message, itemId } = req.body;
    const msg = message.toLowerCase();

    let contextItem = null;
    if (itemId) {
      contextItem = await Item.findById(itemId);
    }

    // Logic for item-specific context
    if (contextItem) {
      if (msg.includes("price") || msg.includes("cost") || msg.includes("how much")) {
        return res.json({ 
          reply: `Rent for ${contextItem.name} is ₹${contextItem.pricePerDay}/day`,
          quickReplies: ["Rent rules", "Book Now", "Contact Owner"]
        });
      }
      if (msg.includes("avail") || msg.includes("stock") || msg.includes("left")) {
        const stockStatus = contextItem.availableQuantity > 0 
          ? `We have ${contextItem.availableQuantity} units available right now!` 
          : `Sorry, this item is currently out of stock.`;
        return res.json({ 
          reply: stockStatus,
          quickReplies: ["Check similar", "Contact Owner"]
        });
      }
      if (msg.includes("locat") || msg.includes("where")) {
        return res.json({ 
          reply: `You can find this item in ${contextItem.location}.`,
          quickReplies: ["Get directions", "Show map"]
        });
      }
    }


    // General Logic
    if (msg.includes("rent rule") || msg.includes("how it work")) {
      return res.json({ 
        reply: "RentIt works on a 24-hour rental cycle. You pick a start time and return it exactly 24 hours later (or multiples thereof). Longer rentals (>3 days) get automatic discounts!",
        quickReplies: ["3-day discount", "7-day discount"]
      });
    }

    if (msg.includes("discount") || msg.includes("offer")) {
      return res.json({ 
        reply: "We offer 10% off for rentals over 3 days and 20% off for rentals over 7 days! The discount is applied automatically during checkout.",
        quickReplies: ["Book DSLR", "Book Trekking Kit"]
      });
    }

    if (msg.includes("contact") || msg.includes("support")) {
        return res.json({ 
          reply: "You can contact our support team at support@rentit.com or chat directly with owners via the WhatsApp button on any item page.",
          quickReplies: ["Email support", "Back to browse"]
        });
    }

    // Default Fallback
    res.json({ 
      reply: "Here are some items you can explore!",
      quickReplies: ["Price info", "Stock status", "Rental rules"]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
