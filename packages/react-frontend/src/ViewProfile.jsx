import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation, Link } from "react-router-dom";

function ViewProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const chefId = location.state.chefId;
  console.log(location.state.chefId);

  const [foodName, setFoodName] = useState("");
  const [availability, setAvailability] = useState(false);
  const [price, setPrice] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [description, setDescription] = useState("");

  const addItem = async (e) => {
    e.preventDefault();
    const newItem = {
      chef: chefId,
      foodName: foodName,
      availability: availability,
      price: parseFloat(price),
      cuisine: cuisine.split(",").map((cuisine) => cuisine.trim()),
      description: description,
    };

    try {
      const API_PREFIX = "http://localhost:8000";
      const response = await fetch(`${API_PREFIX}/chefs/${chefId}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (response.status === 201) {
        setFoodName("");
        setAvailability(false);
        setPrice("");
        setCuisine("");
        setDescription("");
      } else {
        console.error("Failed to add review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="container">
      <h2>Add Menu Item</h2>
      <form onSubmit={addItem}>
        <label htmlFor="foodName">Food Name:</label>
        <input
          type="text"
          id="foodName"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          required
        />

        <label htmlFor="availability">Availability:</label>
        <input
          type="checkbox"
          id="availability"
          checked={availability}
          onChange={(e) => setAvailability(e.target.checked)}
        />

        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label htmlFor="cuisine">Cuisine (comma-separated):</label>
        <input
          type="text"
          id="cuisine"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
        />

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}

export default ViewProfile;
