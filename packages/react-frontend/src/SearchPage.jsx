import React, { useState, useEffect } from "react";
import MenuPage from "./MenuPage"
import { useNavigate } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

function ChefCard({ chef }) {
  const [menuData, setMenuData] = useState(null);
  const [selectedChef, setSelectedChef] = useState(null);
  const navigate = useNavigate();

  function getAverageRating(chef) {
    if(chef.averageRating)
      {
        return chef.averageRating.toFixed(2);
      }
    if(!chef.reviews || chef.reviews.length === 0){
        return 0;
      }
    const total = chef.reviews.reduce((accumulator, currReview) => accumulator + currReview.rating, 0);
    const avgRating = total / chef.reviews.length;
    return avgRating.toFixed(2);
  }

  function getMenu(chefId)
  {
    const API_PREFIX = "http://localhost:8000";
    fetch(`${API_PREFIX}/chefs/${chefId}/menu`)
    .then((response) => {
      if(response.status === 200){
        return response.json()
      }
    })
    .then((menuData) => { 
      navigate(`/chef/${chefId}/menu`, { state: { menuData, chef } });
      console.log(menuData);
      setMenuData(menuData);
    })
    .catch((error) => {
      console.error('Error fetching search results:', error);
    });
  }

  return (
    <div className="card">
      <h2>
        {chef.firstName} {chef.lastName}
      </h2>
      <img src={chef.profilePicture} className="chef-image"/>
      <p>Price: {chef.price}</p>
      <p>Cuisines: {chef.cuisines.join(", ")}</p>
      <p>Location: {chef.location}</p>
      <p> Average Rating: 
      <ReactStars
        count={5}
        value={parseFloat(getAverageRating(chef))}
        size={24}
        activeColor="#ffd700"
        edit={false}
        isHalf={true}
      />
      </p> 
      <button onClick={() => getMenu(chef._id)}>Menu</button>
    </div>
  );
}

function PageHeader({handleSearch}) {
  const [searchString, setSearchString] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(false);
  return (
    <div className="container">
      <center>
        <h1> ChefConnect</h1>
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
        <div>
          <label>
          <input type="checkbox" id="rating-filter" name="rating-filter" 
            checked={minRating} 
            onChange={(e) => setMinRating(e.target.checked)}/>
             4 stars and up 
          </label>
        </div>
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
