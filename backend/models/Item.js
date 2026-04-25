import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please provide item name"],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Trekking Gear",
        "Cameras",
        "Cameras & Photography",
        "Gaming Consoles",
        "Riding Gear",
        "Action Cameras",
        "Musical Instruments",
        "Camping Gear",
        "Electronics",
        "Home Appliances",
        "Tools",
        "Other"
      ],
    },
    condition: {
      type: String,
      required: true,
      enum: ["New", "Like New", "Good", "Fair"],
    },
    pricePerDay: {
      type: Number,
      required: [true, "Please provide price per day"],
      min: 0,
    },
    location: {
      type: String,
      required: true,
    },
    locationCoords: {
      lat: Number,
      lng: Number
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please provide description"],
    },
    availability: {
      type: [Date],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    availableQuantity: {
      type: Number,
      default: function () {
        return this && this.quantity !== undefined ? this.quantity : 1;
      }
    },
    bookingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;
