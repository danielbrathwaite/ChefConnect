// src/Form.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// code for file upload is borrowed from pluralsight.com
function FileUploader({onFileSelect})
{
    const handleFileInput = (event) => {
        onFileSelect(event.target.files[0])
    }
    return (
        <div>
          <input type="file" onChange={handleFileInput} />
        </div>
      );
}

function ChefProfile(props)
{
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        chefId: "",
        firstName: "",
        lastName: "",
        address: "",
        phoneNumber: "",
        specialities: "",
        menu: "",
        profilePic: null
        }
    );

    function handleChange(event) {
        const { name, value } = event.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value
          }));
      }

    function submitProfile() 
    {
        props.handleSubmit(profile);
        setProfile({ chefId: "", firstName: "", lastName: "", 
                    address: "", phoneNumber: "", specialities: "", 
                    menu: "", profilePic: null});
        navigate('/createProfileDone');
    }

    return (
        <div>
        <h1>To get cooking, create a Profile</h1>
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
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            name="address"
            id="address"
            value={profile.address}
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
          <label htmlFor="specialities">Specialities:</label>
          <input
            type="text"
            name="specialities"
            id="specialities"
            value={profile.specialities}
            onChange={handleChange}
          />
          <label htmlFor="menu">Menu:</label>
          <input
            type="text"
            name="menu"
            id="menu"
            value={profile.menu}
            onChange={handleChange}
          />
          <label htmlFor="profilePic">Profile Picture:</label>
          <FileUploader onFileSelect={(file) => setProfile({ ...profile, profilePic: file })}/>
          <input type="button" value="Submit" onClick={submitProfile} />
        </form>
        </div>
      );
}

export default ChefProfile;