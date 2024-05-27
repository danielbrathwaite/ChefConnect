import React, { useState, useEffect } from "react";

function ChefCard({ chef }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>
          {chef.firstName} {chef.lastName}
        </h2>
        <img src={chef.profilePicture} alt="No profile picture" className="profile-picture" />
      </div>
      <p>Price: {chef.price}</p>
      <p>Cuisines: {chef.cuisines}</p>
      <p>Location: {chef.location}</p>
      <p>Rating: {chef.rating}</p> 
      <button>Menu</button>
    </div>
  );
}

function PageHeader({handleSearch}) {
  const [searchString, setSearchString] = useState("");
  return (
    <div className="container">
      <center>
        <h1> Chefs List</h1>
      </center>
      <form className="input-box" onSubmit={handleSearch}>
        <input
          type="search"
          name="search-input"
          id="search-input"
          className="search-input"
          placeholder="Search by Cuisine"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <button type="submit"> Search</button>
      </form>
    </div>
  );
}

function SearchPage(props) {
  return (
    <div>
      <PageHeader handleSearch={props.handleSearch}/>
      <div className="card-container">
                  {props.chefData.map((chef, index) => (
                    <ChefCard key={index} chef={chef} />
                  ))}
                </div>
    </div>
  );
}

export default SearchPage;
