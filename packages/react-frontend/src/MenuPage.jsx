import { useState, useEffect } from "react";
import Table from "./Table";
import { useLocation } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Reviews({reviews})
{
  return (
    <div>
      <h3>Reviews</h3>
      {reviews.map((review, index) => (
        <div key={index}>
          <p className="review-date">{review.date}</p>
          <p className="review-comment">{review.comment}</p>
          <p className="review-rating">Rating: {review.rating}</p>
        </div>
      ))}
    </div>
  );
}
function MenuPageHeader({ chef })
{
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '10px',
  };

  return(
    <div className="container">
        <h2>
          Chef {chef.firstName} {chef.lastName}'s Menu 
        </h2>
        <img src={chef.profilePicture} className="chef-image"/>
        <Slider {...settings}>
          {chef.foodGallery.map((imageUrl, index) => (
            <div className="carousel-item" key={index}>
              <img src={imageUrl} alt={`Image ${index}`} />
            </div>
          ))}
        </Slider>
    </div>
  );
}


function MenuPage()
{
  const location = useLocation();
  const { menuData = [], chef = {} } = location.state || {};
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getReviews = async (chefId) => {
      try {
        const API_PREFIX = "http://localhost:8000";
        const response = await fetch(`${API_PREFIX}/chefs/${chefId}/reviews`);
        if(response.status === 200){
          const reviews = await response.json();
          setReviews(reviews);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    getReviews(chef._id);
  }, [chef._id]);

  return (
    <div className="container">
      <MenuPageHeader chef={chef}/>
      <div>
      <Table menu={menuData}/>
      </div>
      <Reviews reviews={reviews}/>
    </div>
  );
}

export default MenuPage;