import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

//Review schema for embedding into chefschema
const ReviewSchema = new mongoose.Schema({
  /*reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',  
      required: true
  },*/
  rating: {
      type: Number,
      required: true
  },
  comment: {
      type: String,
      required: false
  },
  date: {
      type: Date,
      default: Date.now
  }
});


const ChefSchema = new mongoose.Schema(
  {
    email: {
        type: String,
        required: true,
        unique: true
      },
    password: {
        type: String,
        required: true
      },
    firstName: {
        type: String,
        required: true
      },
    lastName: {
        type: String,
        required: true
      },
    address: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false
    },
    cuisines: {
        type: [String],
        required: false
    },
    reviews: {
        type: [ReviewSchema],
        required: false
    },
    profilePicture: {
      type: String
    }
  },
  { collection: "chefs_list" }
);

const Chef = mongoose.model("Chef", ChefSchema);



export default Chef;