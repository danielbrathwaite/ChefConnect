import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

//ichef makes serves meals like courses, so set amount price per person and 
// user can pick the amount of people to serve 
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

export default foodOrder;
