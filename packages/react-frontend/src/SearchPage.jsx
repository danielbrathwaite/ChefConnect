import React, { useState, useEffect } from "react";

function ChefCard({ chef }) {

  function getAverageRating(reviews) {
    if(!reviews || reviews.length === 0){
        return "No ratings";
      }
    const total = reviews.reduce((accumulator, currReview) => accumulator + currReview.rating, 0);
    const avgRating = total / reviews.length;
    return avgRating;
  }

  return (
    <div className="card">
      <h2>
        {chef.firstName} {chef.lastName}
      </h2>
      <p>Price: {chef.price}</p>
      <p>Cuisines: {chef.cuisines.join(', ')}</p>
      <p>Location: {chef.location}</p>
      <p> Average Rating: {getAverageRating(chef.reviews)}</p> 
      <button>Menu</button>
    </div>
  );
}

function PageHeader({handleSearch}) {
  const [searchString, setSearchString] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  return (
    <div className="container">
      <center>
        <h1> Chefs List</h1>
      </center>
      <form className="small-container" onSubmit={handleSearch}>
        <input
          type="search"
          name="search-input"
          id="search-input"
          className="search-input"
          placeholder="Search by Cuisine"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        <div className="price-filter">
          <input 
          type="number" id="min-price" placeholder="Min Price" 
          value={minPrice} 
          onChange={(e) => setMinPrice(e.target.value)}
          />
          <input type="number" id="max-price" placeholder="Max Price" 
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {/* <div>
          <label>
          <input type="checkbox" id="rating-filter" name="rating-filter" 
            checked={minRating} 
            onClick={(e) => setMinRating(e.target.checked)}/>
            4 stars and up
          </label>
        </div> */}
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
