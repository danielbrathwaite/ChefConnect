import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login(props) {
  const [creds, setCreds] = useState({
    username: "",
    pwd: "",
  });

  const navigate = useNavigate();
  const loginReroute = () => navigate("/search");

  return (
    <div class="small-container">
      <Link to="/">Home</Link>
      <form>
        <label htmlFor="username">UserName</label>
        <input
          type="text"
          name="username"
          id="username"
          value={creds.username}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={creds.pwd}
          onChange={handleChange}
        />
        <input
          type="button"
          value={props.buttonLabel || "Log In"}
          onClick={submitForm}
        />
      </form>
    </div>
  );

  function handleChange(event) {
    const { name, value } = event.target;
    switch (name) {
      case "username":
        setCreds({ ...creds, username: value });
        break;
      case "password":
        setCreds({ ...creds, pwd: value });
        break;
    }
  }

  function submitForm() {
    props.handleSubmit(creds).then((response) => {
      if (response.status === 200) {
        loginReroute();
      } else {
        // Handle bad login
      }
    });
    setCreds({ username: "", pwd: "" });
  }
}
export default Login;
