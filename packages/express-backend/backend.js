import express, { query } from "express";
import cors from "cors";
import multer from "multer";

import userService from "./services/user-service.js";
import chefService from "./services/chef-service.js";
import { authenticateUser, registerUser, loginUser } from "./auth.js";
import chefList from "./models/chefList.js";
import Chef from "./models/chef.js";
import {v2 as cloudinary} from 'cloudinary';

import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dslmarna0', 
  api_key: '743962474496839', 
  api_secret: 'P8WYE5K596_PalkxT6DAGuyx6uE' 
});

async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "auto",
  });
  return res;
}
const storage = new multer.memoryStorage();
const upload = multer({
  storage,
});


const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// gets the inputted form, stores base64 image in cloudinary and converts it 
// to a url, stores that url in the database  
app.post('/chefs', async (req, res) => {
  try {
    const {email, password, firstName, lastName, location, phoneNumber, cuisines, price, reviews, image, foodGallery} = req.body;
    console.log("sent in json", req.body)
    //console.log("image", image)
    // Upload image to Cloudinary
    let profilePicture;
    if (image != null){
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'chefs',
      use_filename: true,
      unique_filename: false,
    });

    profilePicture = uploadResponse.secure_url;
  }
  else{
    profilePicture = 'noimage';
  }
    const newChef = {
      email,
      password,
      firstName,
      lastName,
      location,
      phoneNumber,
      cuisines,
      price,
      reviews,
      profilePicture,
      foodGallery
    };
    console.log("cheef", newChef)
    await chefService.addChef(newChef);

    res.status(201).json({ message: 'Chef created successfully', chef: newChef });
  } catch (error) {
    console.error('Error uploading image or saving data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//IN PROGRESS, updates the chef profile
app.put('/chefs/:id', async (req, res) => {
  try {
    const {email, password, firstName, lastName, location, phoneNumber, cuisines, price, image } = req.body;
  
    // Upload image to Cloudinary
    let profilePicture;
    if (image != null){
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'chefs',
      use_filename: true,
      unique_filename: false,
    });

    profilePicture = uploadResponse.secure_url;
  }
  else{
    profilePicture = 'https://res.cloudinary.com/dslmarna0/image/upload/v1716579874/chefs/noProfilePic.webp';
  }
  if (profilePicture != 'https://res.cloudinary.com/dslmarna0/image/upload/v1716579874/chefs/noProfilePic.webp')
    {
      profilePicture = cloudinary.url(profilePicture, {
        width: 200,
        height: 200,
        crop: 'fill'
      });
      
    } 
    const newChef = {
      email,
      password,
      firstName,
      lastName,
      location,
      phoneNumber,
      cuisines,
      price,
      profilePicture
    };
    console.log("cheef", newChef)
    await chefService.addChef(newChef);

    res.status(201).json({ message: 'Chef created successfully', chef: newChef });
  } catch (error) {
    console.error('Error uploading image or saving data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// homepage stuff
app.get("/", (req, res) => {
  res.send("Welcome to ChefConnect!");
});

app.get("/users", (req, res) => {
  userService.getUsers()
  .then ((result) => {
    res.send({users_list: result})})
  .catch(error => {
      console.error("Error fetching users:", error);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/search", async (req, res) => {
  try {
    // Extract query parameters from the request
    const { name, cuisine, location, minPrice, maxPrice, minRating } = req.query;

    // Construct the filter object based on the provided parameters
    const filter = {};
    if (name) {
      filter.$or = [
        { firstName: { $regex: new RegExp(name, 'i') } },
        { lastName: { $regex: new RegExp(name, 'i') } }
      ];
    }
    if (cuisine) filter.cuisines = { $regex: new RegExp(cuisine, 'i') };
    if (location) filter.location = { $regex: new RegExp(location, 'i') };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }
    if (minRating) {
      filter['reviews.rating'] = { $gte: parseInt(minRating) };
    }

    // Query the database with the constructed filter
    const chefs = await Chef.find(filter).sort({ firstName: 1, lastName: 1 }).select('firstName lastName cuisines location price reviews profilePicture');

    // Send the response with the filtered chefs
    res.json(chefs);
  } catch (error) {
    console.error('Error searching for chefs:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get("/users/:id", (req, res) => {
    const id = req.params["userId"];
    userService.findUserById(id).then((result) => {
      if (result === undefined || result === null)
        res.status(404).send("Resource not found.");
      else res.send({ users_list: result });
    });
});
  
app.post("/users", authenticateUser, (req, res) => {
    const user = req.body;
    userService.addUser(user).then((savedUser) => {
      if (savedUser) res.status(201).send(savedUser);
      else res.status(500).end();
    });
});
  
app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  if (id === undefined)
  {
    res.status(404).send("Resource not found")
  } else {
    userService.deleteUserById(id).then(() => {
    res.status(204).send("Successful delete");}
    )
  ;
}});

app.get("/chefs/:id", (req, res) => {
  const id = req.params["id"];
  chefService.findChefById(id).then((chef) => {
    if (chef === undefined || chef === null)
      res.status(404).send("Resource not found.");
    else {
      //for loop for calculating average rating
    let averageRating = 0;
    if (chef.reviews.length > 0) {
      let totalRating = 0;
      for (let i = 0; i < chef.reviews.length; i++) {
          totalRating += chef.reviews[i].rating;
      }
        averageRating = totalRating / chef.reviews.length;
    }
    
    res.send({ chefs_list: chef, averageRating: averageRating.toFixed(2) });}
  });
});


app.get("/chefs", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  chefService
  .getChefs(name, job)
  .then((result) => {
    res.send({ chefs_list: result });
  })
  .catch((error) => {
    console.log(error);
    res.status(500).send("An error ocurred in the server.");
  });
});

app.delete("/chefs/:id", (req, res) => {
const id = req.params["id"];
if (id === undefined)
{
  res.status(404).send("Resource not found")
} else {
  chefService.deleteChefById(id).then(() => {
  res.status(204).send("Successful delete");}
  )
;
}});

app.post("/signup", registerUser);

app.post("/login", loginUser);


app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});