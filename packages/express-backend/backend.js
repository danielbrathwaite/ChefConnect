import express from "express";
import cors from "cors";

import userService from "./services/user-service.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to ChefConnect!");
});

app.get("/users/:id", (req, res) => {
    const id = req.params["userId"];
    userService.findUserById(id).then((result) => {
      if (result === undefined || result === null)
        res.status(404).send("Resource not found.");
      else res.send({ users_list: result });
    });
});
  
app.post("/users", (req, res) => {
    const user = req.body;
    userService.addUser(user).then((savedUser) => {
      if (savedUser) res.status(201).send(savedUser);
      else res.status(500).end();
    });
});
  
app.delete("/users/:id", (req, res) => {
    const userToDelete = req.params["userId"];
    userService.deleteUser(userToDelete);
    res.status(204).send();
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});