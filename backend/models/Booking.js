import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    trackingStatus: {
      type: String,
      default: "Preparing"
    },
    location: {
      type: String,
      default: "Warehouse"
    },
    locationCoords: {
      lat: { type: Number, default: 28.6139 },
      lng: { type: Number, default: 77.2090 }
    },
    isInsured: {
      type: Boolean,
      default: false
    },
    paymentStatus: {
      type: String,
      default: "Pending"
    }
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
