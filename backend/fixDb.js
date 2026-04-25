import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect("mongodb://127.0.0.1:27017/rentit").then(async () => {
    console.log("Connected to MongoDB");
    try {
        // Drop the problematic legacy index "user_1" if it exists
        await mongoose.connection.collection('carts').dropIndex('user_1');
        console.log("Dropped legacy 'user_1' index!");
    } catch (e) {
        console.log("No legacy 'user_1' index found or already dropped.");
    }

    try {
        // Drop the whole carts collection to wipe out the nulls natively (ignoring Mongoose schema)
        await mongoose.connection.collection('carts').deleteMany({});
        console.log("Wiped all buggy carts natively!");
    } catch (e) {
        console.log("Error wiping carts", e);
    }

    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
