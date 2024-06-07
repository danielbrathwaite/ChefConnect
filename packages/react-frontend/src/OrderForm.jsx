import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation , Link } from "react-router-dom";


function OrderForm(props) {
  const location = useLocation();
  console.log(location.state.chefId);
  const [order, setOrder] = useState({
    user: "663d0eb03cdff92fbc1f0dee",
    chef: location.state.chefId,
    people: 0,
    orderDirections: "",
    status: "pending",
    phoneNumber: "",
    orderDate: new Date().toISOString().split("T")[0],
    expirationDate: new Date().toISOString().split("T")[0],
    asap: false
  });

  function submitOrder() {
    const chefId = location.state.chefId;
    console.log(order)
    const API_PREFIX = "http://localhost:8000"; // Adjust this to your backend API URL
    fetch(`${API_PREFIX}/chefs/${chefId}/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((response) => {
        if (response.status === 201) {
        } else {
          // Handle error response
          console.error("Failed to submit order", response);
        }
      })
      .catch((error) => {
        console.error("Error submitting order:", error);
      });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: name === "asap" ? event.target.value === "true" : value,
    }));
  }

  return (
    <div className="container">
      <Link to="/search">Search</Link>
      <h1> Place an Order</h1>
      <form>
      <label htmlFor="directions">Please leave any special directions:</label>
        <textarea
          type="text"
          name="orderDirections"
          id="orderDirections"
          value={order.orderDirections}
          onChange={handleChange}
        />
        <label htmlFor="people">Number of People:</label>
        <input
          type="number"
          name="people"
          id="people"
          value={order.people}
          onChange={handleChange}
        />
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          id="phoneNumber"
          value={order.phoneNumber}
          onChange={handleChange}
        />
        <label htmlFor="asap"> I need food asap </label>
        <select name="asap" id="asap" onChange={handleChange}>
          <option value={true}>yes</option>
          <option value={false}>no</option>
        </select>
        <input type="button" value="Submit" onClick={submitOrder} />
      </form>
    </div>
  );
}

export default OrderForm;
