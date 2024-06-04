import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation , Link } from "react-router-dom";


function OrderForm(props) {
  const location = useLocation();
  const [order, setOrder] = useState({
    user: "663d0eb03cdff92fbc1f0dee",
    chef: location.state.chefId,
    people: 2,
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
      [name]: value,
    }));
  }

  return (
    <div>
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
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          id="phoneNumber"
          value={order.phoneNumber}
          onChange={handleChange}
        />
        <input type="button" value="Submit" onClick={submitOrder} />
      </form>
    </div>
  );
}

export default OrderForm;
