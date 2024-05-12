// src/MyApp.jsx
import React, {useState, useEffect} from 'react';
import ChefProfile from './ChefProfile';
import Layout from './Layout';
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

 
  return (
    // <div className="container">
    //   <ChefProfile handleSubmit={updateList} />
    // </div>

    <Router>
        <Routes>
          <Route path="/createProfile" element={<ChefProfile handleSubmit={updateList} />} />
        </Routes>
    </Router>
  );
}


export default MyApp;
