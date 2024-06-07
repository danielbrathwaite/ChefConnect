import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
// creating a menu item schema
const menuItemSchema = new mongoose.Schema(
  {
    chef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chefs_list",
      required: true,
    },
    foodName: {
      type: String,
      required: true,
    },
    availability: {
      type: Boolean,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    cuisine: {
        type: [String],
        required: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  { collection: "menuItem_list" },
);

const menuItem = mongoose.model("menuItem", menuItemSchema);

export default menuItem;
