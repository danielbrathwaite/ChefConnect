import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation , Link } from "react-router-dom";


function OrderForm(props) {
  const [order, setOrder] = useState({
    user: "",
    Chef: "",
    people: "",
    orderDirections: "",
    status: "",
    location: "",
    phoneNumber: "",
    orderDate: "",
    asap:""
  });



  function handleChange(event) {
    const { name, value } = event.target;
    setOrder((prevOrder) => ({
      ...prevOrder,
      [name]: value,
    }));
  }

  return (
    <div>
      <h1> Place an Order</h1>
      <form>
      <label htmlFor="directions">Please leave any special directions:</label>
        <textarea
          type="text"
          name="directions"
          id="directions"
          value={order.directions}
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
      </form>
    </div>
  );
}

export default OrderForm;
