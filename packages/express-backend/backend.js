import express, { query } from "express";
import cors from "cors";
import multer from "multer";
import bodyParser from "body-parser"
import userService from "./services/user-service.js";
import chefService from "./services/chef-service.js";
import { authenticateUser, registerUser, loginUser } from "./auth.js";
import chefList from "./models/chefList.js";
import Chef from "./models/chef.js";

import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dslmarna0', 
  api_key: '743962474496839', 
  api_secret: 'P8WYE5K596_PalkxT6DAGuyx6uE' 
});


const app = express();
const port = 8000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
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
    // Save chef data in the database (example using a mock database function)
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
    // Mock function to save chef to the database
    await chefService.addChef(newChef);

    res.status(201).json({ message: 'Chef created successfully', chef: newChef });
  } catch (error) {
    console.error('Error uploading image or saving data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//in progress, updates the chef profile
app.put('/chefs/:id', async (req, res) => {
  try {
    const {email, password, firstName, lastName, location, phoneNumber, cuisines, price, image } = req.body;
    //console.log("sent in json", req.body)
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
    // Save chef data in the database (example using a mock database function)
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
    // Mock function to save chef to the database
    await chefService.addChef(newChef);

    res.status(201).json({ message: 'Chef created successfully', chef: newChef });
  } catch (error) {
    console.error('Error uploading image or saving data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//sends image gallery of requested chef
app.get('/chefs/:id/gallery', async (req, res) => {
  try {
    const id = req.params["id"];
    chefService.findChefById(id).then((chef) => {
    if (chef === undefined || chef === null)
      res.status(404).send("Resource not found.");
    else {
    //send gallery straight up
    res.json({message: "Gallery retrieved successfully.", foodGallery: chef.foodGallery})
  }
    
  })}  catch (error) {
    console.error('Error getting images:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//adds an array of image(s) in base64 to gallery of requested chef, security needed?
app.post('/chefs/:id/gallery', async (req, res) => {
  try {
    const id = req.params["id"];
    let foodGallery = req.body.foodGallery;

    if (!Array.isArray(foodGallery) || !foodGallery.every(item => typeof item === 'string')) {
      return res.status(400).send("Invalid input: foodGallery should be an array of strings.");
    }

    const chef = await chefService.findChefById(id);

    if (!chef) {
      return res.status(404).send("Resource not found.");
    }

    // Convert gallery straight up
    let galleryUrls = [];
    for (let i = 0; i < foodGallery.length; i++) {
      const uploadResponse = await cloudinary.uploader.upload(foodGallery[i], {
        folder: 'foodgallery',
        use_filename: true,
        unique_filename: false,
      });
      galleryUrls.push(uploadResponse.secure_url);
    }

    chef.foodGallery = chef.foodGallery.concat(galleryUrls);
    await chef.save();

    res.status(201).json({ message: "Gallery posted successfully.", foodGallery: chef.foodGallery });
  } catch (error) {
    console.error('Error getting images:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/chefs/:id/gallery', async (req, res) => {
  try {
    const id = req.params["id"];
    const itemToDelete = req.body.deletedItem;

    if (!itemToDelete) {
      return res.status(400).json({ message: "Invalid input: item to delete is required." });
    }

    const chef = await chefService.findChefById(id);

    if (!chef) {
      return res.status(404).json({ message: "Resource not found." });
    }

    // Filter out the item to delete
    chef.foodGallery = chef.foodGallery.filter(item => item !== itemToDelete);

    await chef.save();

    res.status(200).json({ message: "Item deleted successfully.", foodGallery: chef.foodGallery });
  } catch (error) {
    console.error('Error deleting item:', error);
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
    const chefs = await Chef.find(filter).select('firstName lastName cuisines location price reviews');

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