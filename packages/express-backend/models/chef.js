import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()


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
    specialties: {
        type: [String],
        required: false
    },
    rating: {
      type: Number,
      required: false
    }
  },
  { collection: "chefs_list" }
);

const Chef = mongoose.model("Chef", ChefSchema);



export default Chef;