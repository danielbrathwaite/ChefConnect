import mongoose from "mongoose";
import chefModel from "../models/chef.js";
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


function findChefByName(name) {
  return chefModel.find({ name: name });
}

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
  findChefByName,
  findChefByJob,
  findChefByNameAndJob,
  deleteChefById
};