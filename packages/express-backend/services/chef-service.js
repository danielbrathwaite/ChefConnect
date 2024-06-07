import mongoose from "mongoose";
import chefModel from "../models/chef.js";
import chefListModel from "../models/chefList.js";
import menuItem from "../models/menuItem.js";
import dotenv from "dotenv";

dotenv.config()
mongoose.set("debug", true);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

function getChefs(name, job) {
  let promise;
  if (name === undefined && job === undefined) {
    promise = chefModel.find();
  } else if (name && !job) {
    promise = findUserByName(name);
  } else if (job && !name) {
    promise = findUserByJob(job);
  }
    else if(name && job){
    promise = findChefByNameAndJob(name, job);
    }
  return promise;
}

function findChefById(id) {
  return chefModel.findById(id);
}

function addChef(chef) {
  const chefToAdd = new chefModel(chef);
  const promise = chefToAdd.save();
  return promise;
}

function deleteChefById(id) {
  return chefModel.findByIdAndDelete(id);
}

// function searchChefByName(searchName) {
//   const searchRegex = new RegExp(searchName, 'i');
//   //if searching a full name
//   const searchTerms = searchName.split(/\s+/);
//   if (searchTerms.length > 1){
//     return chefListModel.find({
//       $or: [
//         { firstName: { $regex: new RegExp(searchTerms[0], 'i') }, 
//         lastName: { $regex: new RegExp(searchTerms[1], 'i') } }
//       ]
//     })
//   }
//   //if searching only one word
//   else {
//   return chefListModel.find({
//     $or: [
//         { firstName: { $regex: searchRegex } },
//         { lastName: { $regex: searchRegex } }
//     ]
// });
//   }
// }

function findChefByJob(job) {
  return chefModel.find({ job: job });
}

function findChefByNameAndJob(name, job){
    return chefModel.find({name: name, job: job});
}

export default {
  addChef,
  getChefs,
  findChefById,
  findChefByJob,
  findChefByNameAndJob,
  deleteChefById
};

