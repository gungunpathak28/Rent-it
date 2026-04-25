import mongoose from "mongoose";

const paymentConfigSchema = new mongoose.Schema({
  upiId: {
    type: String,
    default: "pritipathakcute1980@okicici"
  },
  qrImage: {
    type: String,
    default: ""
  }
}, { timestamps: true });

export default mongoose.model("PaymentConfig", paymentConfigSchema);
