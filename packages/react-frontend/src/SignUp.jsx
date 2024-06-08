import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function SignUp(props) {
  const [creds, setCreds] = useState({
    username: "",
    pwd: "",
    usertype: "chef",
  });

  const navigate = useNavigate();
  const signupReroute = (creds) => {
    if (creds.usertype === "chef") {
      navigate("/profile", {
        state: {
          username: creds.username,
          password: creds.pwd,
          usertype: creds.usertype,
        },
      });
    } else {
      navigate("/search", { state: { usertype: creds.usertype } });
    }
  };

  return (
    <div className="small-container">
      <Link to="/">Home</Link>
      <form>
        <label htmlFor="username">UserName (email) </label>
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
        <label htmlFor="usertype"> I'm here to ...</label>
        <select
          name="usertype"
          id="usertype"
          value={creds.usertype}
          onChange={handleChange}
        >
          <option value="chef">be a chef</option>
          <option value="user">browse</option>
        </select>
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
      case "usertype":
        setCreds({ ...creds, usertype: value });
        break;
    }
  }

  function submitForm() {
    props.handleSubmit(creds).then((response) => {
      if (response.status === 201) {
        signupReroute(creds);
      } else {
        // Handle bad login
      }
    });
    setCreds({ username: "", pwd: "", usertype: "chef" });
  }
}
export default SignUp;
