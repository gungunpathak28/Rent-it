import mongoose from "mongoose";
import User from "./models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fetch from "node-fetch"; // Node 18+ has fetch natively

dotenv.config();

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rentit");
    const user = await User.findOne({});
    if (!user) return console.log("No user found");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback_secret", {
      expiresIn: "30d",
    });

    const body = {
      itemId: "69df0c5410e2370a0f8bd6e3", // Invalid random ObjectId maybe?
      quantity: 1
    };

    // We don't know the exact item id, so let's fetch one from DB
    const Item = (await import("./models/Item.js")).default;
    const realItem = await Item.findOne({});
    if (realItem) {
       body.itemId = realItem._id;
    }

    console.log("Testing with body:", body);

    const res = await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    console.log("Response Status:", res.status);
    console.log("Response Body:", data);

  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
};
test();
