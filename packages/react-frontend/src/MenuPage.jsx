import Table from "./Table";
import { useLocation } from "react-router-dom";

function MenuPageHeader({ chef })
{
  return(
    <div className="container">
        <h2>
          Chef {chef.firstName} {chef.lastName}
        </h2>
        <img src={chef.profilePicture} className="chef-image"/>
    </div>
  );
}

function MenuPage()
{

  const location = useLocation();
  const { menuData = [], chef = {} } = location.state || {};

  return (
    <div>
      <h1> menu</h1>
      <MenuPageHeader chef={chef}/>
      <div>
      <Table menu={menuData}/>
      </div>
      
    </div>
  );
}

export default MenuPage;