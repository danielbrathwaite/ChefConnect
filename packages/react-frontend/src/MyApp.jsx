// src/MyApp.jsx
import React, {useState, useEffect} from 'react';
import ChefProfile from './ChefProfile';
import HomePage from './HomePage'
import Layout from './Layout';
import ProfileDone from './ProfileDone';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./SignUp";
import SearchPage from "./SearchPage";
import MenuPage from "./MenuPage";


function MyApp() {
  const [chefData, setChefData] = useState([]);
  const [chefProfiles, setChefProfiles] = useState([]);
  const updateList = (newChefProfile) => {
    setChefProfiles([...chefProfiles, newChefProfile]);
  };

  const INVALID_TOKEN = "INVALID_TOKEN";
  const [token, setToken] = useState(INVALID_TOKEN);
  const [message, setMessage] = useState("");

  // const API_PREFIX = "chefconnect.azurewebsites.net";
  const API_PREFIX = "https://chefconnectbackend.azurewebsites.net";
  // const API_PREFIX = "http://localhost:8000";
  

  useEffect(() => {
    fetchChefs()
      .then((res) => (res.status === 200 ? res.json() : undefined))
      .then((json) => {
        if (json) {
          setChefData(json["chefs_list"]);
        } else {
          setChefData(null);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
          return response;
        } else {
          setMessage(`Login Error ${response.status}: ${response.data}`);
          return response;
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
            `Signup successful for user: ${creds.username}; auth token saved`,
          );
          return response;
        } else {
          setMessage(`Signup Error ${response.status}: ${response.data}`);
          return response;
        }
      })
      .catch((error) => {
        setMessage(`Signup Error: ${error}`);
      });
  
    return promise;
  }

  function addChefProfile(chefProfile)
  {
    const promise = fetch(`${API_PREFIX}/chefs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chefProfile),
    })
    .then((response) => {
      if (response.status === 201) {
        return response;
      } else {
        return response;
      }
    })
    .catch((error) => {
      setMessage(`Profile Error: ${error}`);
    });
    return promise;
  }

  function fetchChefs() {
    const promise = fetch(`${API_PREFIX}/chefs`, {
      headers: addAuthHeader(),
    });

    return promise;
  }
  function handleSearch(event){
    event.preventDefault();
    const searchCuisine = event.target.elements['search-input'].value;
    const minPrice = event.target.elements['min-price'].value;
    const maxPrice = event.target.elements['max-price'].value;
    fetch(`${API_PREFIX}/search?cuisine=${searchCuisine}&minPrice=${minPrice}&maxPrice=${maxPrice}`)
    .then((response) => {
      if(response.status === 200){
        return response.json()
      }
    })
    .then((data) => {
      console.log(data);
      setChefData(data);
    })
    .catch((error) => {
      console.error('Error fetching search results:', error);
    });
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
        <Route index element={<HomePage />}/>
        <Route path="/login" element={<Login handleSubmit={loginUser} />} />
        <Route path="/signup" element={<SignUp handleSubmit={signupUser} buttonLabel="Sign Up" />} />
        <Route path="/search" element={<SearchPage chefData={chefData} handleSearch={handleSearch}/>} />
        <Route path="/profile" element={<ChefProfile handleSubmit={addChefProfile}/>} />
        <Route path="/chef/:id/menu" element={<MenuPage/>} /> 
      </Routes>
    </Router>
  );
}


export default MyApp;
