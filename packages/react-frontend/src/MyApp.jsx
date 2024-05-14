// src/MyApp.jsx
import React, {useState, useEffect} from 'react';
import ChefProfile from './ChefProfile';
import HomePage from './HomePage'
import Layout from './Layout';
import ProfileDone from './ProfileDone';
import Login from './Login';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link
} from "react-router-dom";



function MyApp() {
  const [chefProfiles, setChefProfiles] = useState([]);

  const updateList = (newChefProfile) => {
    setChefProfiles([...chefProfiles, newChefProfile]);
  };

  const INVALID_TOKEN = "INVALID_TOKEN";
  const [token, setToken] = useState(INVALID_TOKEN);
  const [message, setMessage] = useState("");
  const API_PREFIX = "http://localhost:5173";

  function fetchUsers() {
    const promise = fetch(`${API_PREFIX}/users`, {
      headers: addAuthHeader()
    });
  
    return promise;
  }

  function addAuthHeader(otherHeaders = {}) {
    if (token === INVALID_TOKEN) {
      return otherHeaders;
    } else {
      return {
        ...otherHeaders,
        Authorization: `Bearer ${token}`
      };
    }
  }

  function loginUser(creds) {
    const promise = fetch(`${API_PREFIX}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(creds)
    })
      .then((response) => {
        if (response.status === 200) {
          response
            .json()
            .then((payload) => setToken(payload.token));
          setMessage(`Login successful; auth token saved`);
        } else {
          setMessage(
            `Login Error ${response.status}: ${response.data}`
          );
        }
      })
      .catch((error) => {
        setMessage(`Login Error: ${error}`);
      });
  
    return promise;
  }
  
  function signupUser(creds) {
    const promise = fetch(`${API_PREFIX}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(creds)
    })
      .then((response) => {
        if (response.status === 201) {
          response
            .json()
            .then((payload) => setToken(payload.token));
          setMessage(
            `Signup successful for user: ${creds.username}; auth token saved`
          );
        } else {
          setMessage(
            `Signup Error ${response.status}: ${response.data}`
          );
        }
      })
      .catch((error) => {
        setMessage(`Signup Error: ${error}`);
      });
  
    return promise;
  }
  
  function fetchUsers() {
    const promise = fetch(`${API_PREFIX}/users`, {
      headers: addAuthHeader()
    });
  
    return promise;
  }
  
  function addAuthHeader(otherHeaders = {}) {
    if (token === INVALID_TOKEN) {
      return otherHeaders;
    } else {
      return {
        ...otherHeaders,
        Authorization: `Bearer ${token}`
      };
    }
  }
 
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/createProfile"  element={<ChefProfile handleSubmit={updateList}/>} />
          <Route path="/createProfileDone"  element={<ProfileDone/>} />
          <Route path="/login"element={<Login handleSubmit={loginUser} />} />
          <Route path="/signup"element={<Login handleSubmit={signupUser} buttonLabel="Sign Up" />}/>
        </Route>
      </Routes>
    </Router>
  );
}


export default MyApp;
