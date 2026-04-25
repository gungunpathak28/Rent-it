import mongoose from "mongoose";
import Item from "./models/Item.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

mongoose.connect("mongodb://127.0.0.1:27017/rentit");

const seed = async () => {
await Item.deleteMany();
const data = require("./backup.json");
const dummyOwnerId = new mongoose.Types.ObjectId();
data.forEach(i => {
  i.ownerId = dummyOwnerId;
  i.condition = i.condition || "New";
  i.image = i.image || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32";
  i.description = i.description || "Dummy description";
});
await Item.insertMany(data);
console.log("Items Restored");
process.exit();
};

seed();
