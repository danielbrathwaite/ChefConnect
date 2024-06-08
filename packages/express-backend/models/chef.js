import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

//Review schema for embedding into chefschema
const ReviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const ChefSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    cuisines: {
      type: [String],
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    reviews: {
      type: [ReviewSchema],
      required: false,
    },
    profilePicture: {
      type: String,
    },
    foodGallery: {
      type: [String],
    },
  },
  { collection: "chefs_list" },
);

const Chef = mongoose.model("Chef", ChefSchema);

export default Chef;
