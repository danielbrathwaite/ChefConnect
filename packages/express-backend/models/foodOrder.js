import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

//changed idea: chef makes meals like courses, so set amount price per person and 
// in the order form, user can pick the amount of people to serve and a box for typing directions about the order. 
// it is up to the chef to reject / accept orders within the expiration date, asap field indicates asap delivery
const foodOrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users_list',
        required: true
    },
    Chef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chefs_list',
        required: true
    },
    people: {
        type: Number,
        required: true
    },
    orderDirections: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        required: true
    },
    orderDate: {
        type: Date,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    asap:{
        type: Boolean,
        required:true
    }

});

const foodOrder = mongoose.model('foodOrder', foodOrderSchema);

module.exports = foodOrder;
