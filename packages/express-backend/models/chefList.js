import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

const ChefListSchema = new mongoose.Schema(
  {
    chef: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Chef',
        required: true },
    firstName: {
        type: String,
        required: true
      },
    lastName: {
        type: String,
        required: true
      },
    price: {
          type: Number,
          required: true
    },
    cuisines: {
        type: [String],
        required: false
    },
    location: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        required: false
    }
  },
  { collection: "chefs_display_list" }
);

const chefList = mongoose.model("chefList", ChefListSchema);



export default chefList;