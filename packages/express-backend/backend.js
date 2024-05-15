import express from "express";
import cors from "cors";

import userService from "./services/user-service.js";
import chefService from "./services/chef-service.js";
import { authenticateUser, registerUser } from "./auth.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// homepage stuff
app.get("/", (req, res) => {
  res.send("Welcome to ChefConnect!");
});

//basic search function
app.get("/search", (req, res) => {
  const searchQuery = req.query.name; 
  const searchResults = chefService.findChefByName(searchQuery)
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


app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

app.post("/signup", registerUser);

app.post("/login", registerUser);