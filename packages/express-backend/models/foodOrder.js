import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const foodOrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Chef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chef',
        required: true
    },
    foods: [{
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    total: {
        type: Number,
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
});

const foodOrder = mongoose.model('foodOrder', foodOrderSchema);

module.exports = foodOrder;
