import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rentit", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to MongoDB");
        
        const Cart = mongoose.model('Cart', new mongoose.Schema({
            userId: mongoose.Schema.Types.ObjectId,
            items: [{
                itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
                quantity: Number
            }]
        }));
        
        // Find any user cart
        const cart = await Cart.findOne();
        if(cart) {
            console.log("Found cart, testing populate...");
            try {
                await cart.populate('items.itemId');
                console.log("Populate successful");
            } catch(e) {
                console.error("Populate error:", e.message);
            }
        } else {
            console.log("No cart found.");
        }
        
    } catch(err) {
        console.error(err);
    } finally {
        process.exit(0);
    }
}
test();
