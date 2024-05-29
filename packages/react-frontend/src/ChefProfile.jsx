// src/Form.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation , Link } from "react-router-dom";

// code for file upload is borrowed from pluralsight.com
function FileUploader({onFileSelect})
{
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

    const handleFileInput = (event) => {
      const file = event.target.files[0];
      convertToBase64(file).then(base64 => {
        console.log(base64); 
        onFileSelect(base64)
      });
        
    }
    return (
        <div>
          <input type="file" onChange={handleFileInput} />
        </div>
      );
}

function ChefProfile(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [profile, setProfile] = useState({
    chefId: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    location: "",
    phoneNumber: "",
    cuisines: "",
    price: "",
    profilePic: null,
  });

  useEffect(() => {
    if(submitted)
      {
        navigate('/search');
      }
  },[submitted, navigate]);


  function handleChange(event) {
    const { name, value } = event.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  }

  function submitProfile() {
    const email = location.state.username;
    const password = location.state.password;
    const updatedProfile = {...profile,  email, password};
    props.handleSubmit(updatedProfile)
    .then((response) => {
      if (response.status === 201) {
        setSubmitted(true);
      } else {
        // Handle bad login
      }
    });
    setProfile({
      chefId: "",
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      location: "",
      phoneNumber: "",
      cuisines: "",
      price: "",
      profilePic: null,
    });
  }

  return (
    <div className="container">
      <Link to="/">Home</Link>
      <h1> Create a Profile</h1>
      <form>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          name="firstName"
          id="firstName"
          value={profile.firstName}
          onChange={handleChange}
        />
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          value={profile.lastName}
          onChange={handleChange}
        />
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          name="location"
          id="location"
          value={profile.location}
          onChange={handleChange}
        />
        <label htmlFor="phoneNumber">Phone Number:</label>
        <input
          type="text"
          name="phoneNumber"
          id="phoneNumber"
          value={profile.phoneNumber}
          onChange={handleChange}
        />
        <label htmlFor="cuisines">Cuisine(s):</label>
        <input
            type="text"
            name="cuisines"
            id="cuisines"
            value={profile.cuisines}
            onChange={handleChange}
          />
      <label htmlFor="price">Price:</label>
        <input
            type="text"
            name="price"
            id="price"
            value={profile.price}
            onChange={handleChange}
          />
        <label htmlFor="profilePic">Profile Picture:</label>
        <FileUploader
          onFileSelect={(file) => setProfile({ ...profile, profilePic: file })}
        />
          <input type="button" value="Submit" onClick={submitProfile} />
      </form>
    </div>
  );
}

export default ChefProfile;
