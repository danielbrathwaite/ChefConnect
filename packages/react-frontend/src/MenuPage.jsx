import { useState, useEffect } from "react";
import Table from "./Table";
import { useLocation } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactStars from "react-rating-stars-component";

function Reviews({reviews})
{
  return (
    <div className="reviews-container">
      <h3>Reviews</h3>
      <div className="reviews-list">
      {reviews.map((review, index) => (
        <div key={index}>
          <p className="review-date">{review.date}</p>
          <p className="review-comment">{review.comment}</p>
          <p className="review-rating">Rating: {review.rating}</p>
        </div>
      ))}
      </div>
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
    // centerPadding: '10px',
  };

  return(
    <div className="container">
        <h2>
          Chef {chef.firstName} {chef.lastName}'s Menu 
        </h2>
        <img src={chef.profilePicture} className="chef-image"/>
        {chef.foodGallery && chef.foodGallery.length > 0 && (
        <>
        <h3 className="gallery-title">Food Gallery</h3>
        <Slider {...settings}>
          {chef.foodGallery.map((imageUrl, index) => (
            <div className="carousel-item" key={index}>
              <img src={imageUrl} alt={`Image ${index}`} />
            </div>
          ))}
        </Slider>
        </>
        )}
    </div>
  );
}

function ReviewForm({chefId})
{
  const [comments, setComments] = useState("");
  const [rating, setRating] = useState(0);

  const ratingChanged = (newRating) => { 
    if (newRating >= 1 && newRating <= 5) {
      setRating(newRating);
    }
  }

  const addReview = async (e) => {
    e.preventDefault();
    const newReview = { comment: comments, rating: rating, date: new Date().toISOString() };

    try {
      const API_PREFIX = "http://localhost:8000";
      const response = await fetch(`${API_PREFIX}/chefs/${chefId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      if (response.status === 201) {
        const addedReview = await response.json();
        setComments("");
        setRating(0);
      } else {
        console.error('Failed to add review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };


  return(
    <form onSubmit={addReview}>
    <h3>Add a Review</h3>
    <label htmlFor="comments">Comments</label>
    <input
      type="text"
      name="comments"
      id="comments"
      value={comments}
      onChange={(e) => setComments(e.target.value)}
    />
    <label htmlFor="rating">Rating</label>
      <ReactStars
      count={5}
      onChange={ratingChanged}
      size={24}
      activeColor="#ffd700"
      isHalf={true}
    />
      {/* type="number"
      name="rating"
      id="rating"
      value={rating}
      onChange={handleRatingChange}
      min="1"
      max="5"
    /> */}
    <input type="submit" value="Submit Rating" />
  </form>
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
      <ReviewForm chefId={chef._id}/>
    </div>
  );
}

export default MenuPage;