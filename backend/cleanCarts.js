import mongoose from 'mongoose';
import Cart from './models/Cart.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect("mongodb://127.0.0.1:27017/rentit").then(async () => {
    console.log("Connected to MongoDB");
    const result1 = await Cart.deleteMany({ userId: null });
    const result2 = await Cart.deleteMany({ user: null }); // just in case the old corrupted structure exists
    const result3 = await Cart.deleteMany({ userId: { $exists: false } });
    console.log(`Cleaned up corrupted carts. Deleted: ${result1.deletedCount + result2.deletedCount + result3.deletedCount}`);
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
