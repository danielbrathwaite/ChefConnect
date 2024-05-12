// src/MyApp.jsx
import React, {useState, useEffect} from 'react';
import Table from "./Table";
import ChefProfile from './ChefProfile';


function MyApp() {
  const [chefProfiles, setChefProfiles] = useState([]);

  const updateList = (newChefProfile) => {
    setChefProfiles([...chefProfiles, newChefProfile]);
  };

 
  return (
    <div className="container">
      <ChefProfile handleSubmit={updateList} />
    </div>
  );
}


export default MyApp;
