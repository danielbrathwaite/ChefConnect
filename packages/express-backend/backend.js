import express, { query } from "express";
import cors from "cors";

import userService from "./services/user-service.js";
import chefService from "./services/chef-service.js";
import { authenticateUser, registerUser, loginUser } from "./auth.js";
import chefList from "./models/chefList.js";
import Chef from "./models/chef.js";


const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

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
  try{
    const { firstName, lastName, cuisines } = req.query;
    const query = {};

    if(firstName){
      query.firstName = new RegExp(firstName, 'i');
    }

    if(lastName){
      query.lastName = new RegExp(lastName, 'i');
    }

    if(cuisines){
      query.cuisines = cuisines;
    }

    // if(minPrice && maxPrice){
    //   query.price = {$gte: minPrice, $lte: maxPrice};
    // }
    // else if (minPrice){
    //   query.price = {$gte: minPrice};
    // }
    // else if (maxPrice){
    //   query.price = {$lte: maxPrice};
    // }

    // if(minRating){
    //   query.rating = {$gte: minRating};
    // }

    const chef_results = await Chef.find(query);
    res.json(chef_results);
  }
  catch(error){
    res.status(500).send(error.message)
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