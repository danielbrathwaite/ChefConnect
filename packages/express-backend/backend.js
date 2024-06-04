import express, { query } from "express";
import cors from "cors";
import multer from "multer";
import bodyParser from "body-parser"
import userService from "./services/user-service.js";
import chefService from "./services/chef-service.js";
import { authenticateUser, registerUser, loginUser } from "./auth.js";
import chefList from "./models/chefList.js";
import Chef from "./models/chef.js";
import menuItem from "./models/menuItem.js";
import foodOrder from "./models/foodOrder.js";

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
    const {email, password, firstName, lastName, location, phoneNumber, cuisines, price, reviews, profilePic, foodGallery} = req.body;
    // Upload image to Cloudinary
    let profilePicture
    if (profilePic != null){
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: 'chefs',
      use_filename: true,
      unique_filename: false,
    });

    profilePicture = uploadResponse.secure_url;
  }
  else{
    profilePicture = 'https://res.cloudinary.com/dslmarna0/image/upload/v1716579874/chefs/noProfilePic.webp';
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
    const {email, password, firstName, lastName, location, phoneNumber, cuisines, price, profilePic } = req.body;
  
    // Upload image to Cloudinary
    let profilePicture;
    if (profilePic != null){
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
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
    await chefService.addChef(newChef);

    res.status(201).json({ message: 'Chef created successfully', chef: newChef });
  } catch (error) {
    console.error('Error uploading image or saving data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//sends foodorders of requested chef
app.get('/chefs/:id/order', async (req, res) => {
  try {
    const id = req.params["id"];
    const Order = await foodOrder.find({ Chef: id });

    const chefExists = await Chef.exists({ _id: id });
    if (!chefExists) {
      return res.status(404).json({ message: "Chef not found" });
    }
    
    if (!Order || Order.length === 0) {
      return res.status(404).json({ message: "Food orders not found" });
    }

    res.status(200).json(Order);
   
    
  }  catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//adds an order to the chef
app.post('/chefs/:id/order', async (req, res) => {
  try {
    const id = req.params["id"];
    req.body.Chef = id;
    const order = new foodOrder(req.body);
    await order.save();


    res.status(201).json({ message: "Gallery posted successfully.", foodOrder: order });
  } catch (error) {
    console.error('Error posting order:', error);
    res.status(400).send(error);
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
    const { name, cuisine, location, minPrice, maxPrice, minRating, sortField, sortOrder } = req.query;

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

    // Aggregation pipeline to calculate average rating and filter/sort results
    const pipeline = [
      { $match: filter },
      {
        $addFields: {
          averageRating: { $avg: "$reviews.rating" }
        }
      },
    ];

    // Filter by minimum average rating if provided
    if (minRating) {
      pipeline.push({ $match: { averageRating: { $gte: parseInt(minRating) } } });
    }

    // Construct the sort object based on the provided parameters
    let sort = {};
    if (sortField && (sortField === 'price' || sortField === 'averageRating')) {
      sort[sortField] = sortOrder && sortOrder.toLowerCase() === 'desc' ? -1 : 1;
      pipeline.push({ $sort: sort });
    } else {
      // Default sorting
      pipeline.push({ $sort: { firstName: 1, lastName: 1 } });
    }

    // Project the necessary fields
    pipeline.push({
      $project: {
        firstName: 1,
        lastName: 1,
        cuisines: 1,
        location: 1,
        price: 1,
        averageRating: 1,
        profilePicture: 1,
      }
    });

    // Execute the aggregation pipeline
    const chefs = await Chef.aggregate(pipeline);

    // Send the response with the filtered and sorted chefs
    res.json(chefs);
  } catch (error) {
    console.error('Error searching for chefs:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


app.get("/chefs/:chefId/menu", async (req, res) => {
  try {
    const chefId = req.params.chefId;
    // Find menu items by chefId and populate the 'chef' field with the chef's firstName and lastName
    const menuItems = await menuItem.find({ chef: chefId });

    if (!menuItems || menuItems.length === 0) {
      return res.status(404).json({ message: "Chef or menu items not found" });
    }

    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: `An error occurred: ${error.message}` });
  }
});

//adds an order to the chef
app.post('/chefs/:id/menu', async (req, res) => {
  try {
    const id = req.params["id"];
    req.body.chef = id;
    const menuitem = new menuItem(req.body);
    await menuitem.save();


    res.status(201).json({ message: "menu item added."});
  } catch (error) {
    console.error('Error posting order:', error);
    res.status(400).send(error);
  }
});

app.get("/chefs/:chefId/reviews", async (req, res) => {
  try {
    const chefId = req.params.chefId;
    const chef = await Chef.findById(chefId, 'reviews');
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }
    res.status(200).json(chef.reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post("/chefs/:chefId/reviews", async (req, res) => {
  try {
    const chefId = req.params.chefId;
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({ message: 'Rating is required' });
    }

    const chef = await Chef.findById(chefId);
    if (!chef) {
      return res.status(404).json({ message: 'Chef not found' });
    }

    const newReview = {
      rating,
      comment,
      date: new Date()
    };

    chef.reviews.push(newReview);

    await chef.save();

    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
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

app.post("/chefs", (req, res) => {
  const chef = req.body;
  chefService.addChef(chef).then((savedChef) => {
    if (savedChef) res.status(201).send(savedChef);
    else res.status(500).end();
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