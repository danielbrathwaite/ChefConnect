import express from "express";
import cors from "cors";
import multer from "multer";

import userService from "./services/user-service.js";
import chefService from "./services/chef-service.js";
import { authenticateUser, registerUser, loginUser } from "./auth.js";
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

app.post('/chefs', async (req, res) => {
  try {
    const { firstName, lastName, address, phoneNumber, cuisine, image } = req.body;

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'chefs',
      use_filename: true,
      unique_filename: false,
    });

    const imageUrl = uploadResponse.secure_url;

    // Save chef data in the database (example using a mock database function)
    const newChef = {
      firstName,
      lastName,
      address,
      phoneNumber,
      cuisine,
      imageUrl
    };

    // Mock function to save chef to the database
    chefService.addChef(newChef).then(() => {
    })

    res.status(201).json({ message: 'Chef created successfully', chef: newChef });
  } catch (error) {
    console.error('Error uploading image or saving data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post("/chefs", (req, res) => {
  const chef = req.body;
  chefService.addChef(chef).then((savedChef) => {
    if (savedChef) res.status(201).send(savedChef);
    else res.status(500).end();
  });
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

//basic search function, right now only checks if query matches firstName or lastName
// plan: when nothing is filtered, send the entire list
// figure out how to send the available filters while the customers are searching
// edit findChefByName
app.get("/search", (req, res) => {
  const { name, cuisine, minPrice, maxPrice, minRating } = req.query;
  //preset filters
  cuisineFilters =  ["American", "Italian", "French"];
  const searchResults = chefService.findChefByName(searchQuery)
  searchResults.then((result) => {
    if (result === undefined || result === null)
      res.status(404).send("Resource not found.");
    else res.send({ users_list: result });
  });
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
