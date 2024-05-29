import Table from "./Table";

function MenuPage(props) {
  const [menuItem, setMenuItem] = useState({
    chef: "",
    foodName: "",
    availability: "",
    price: "",
    cuisine: "",
    description: "",
  });
}

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

function MenuPage(props)
{
  const menuData = props.menuItem;
  return (
    <div>
      <MenuPageHeader/>
      {/* <Table menuData={menuData}/> */}
    </div>
  );
}