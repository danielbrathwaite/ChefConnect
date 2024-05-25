import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div class="medium-container">
      <h1>Welcome to ChefConnect!</h1>
      <p>Hey there! Welcome to the homepage of ChefConnect.
        Let's get right to connecting you with the best professional
        chefs around!
      </p>
      <Link type="button" to="/login">Log In</Link>
      <Link type="button" to="/signup">Sign Up</Link>

    </div>
  );
};

export default Home;
