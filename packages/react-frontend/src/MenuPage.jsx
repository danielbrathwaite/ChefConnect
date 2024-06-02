import { useEffect } from "react";
import Table from "./Table";
import { useLocation } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  return (
    <div className="container">
      <MenuPageHeader chef={chef}/>
      <div>
      <Table menu={menuData}/>
      </div>
    </div>
  );
}

export default MenuPage;