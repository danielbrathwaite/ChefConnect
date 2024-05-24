// src/Form.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

function ChefProfile(props)
{
    const [profile, setProfile] = useState({
        chefId: "",
        firstName: "",
        lastName: "",
        address: "",
        phoneNumber: "",
        cuisine: "",
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
        console.log(profile);
        setProfile({ chefId: "", firstName: "", lastName: "", 
                    address: "", phoneNumber: "", cuisine: "", 
                    menu: "", profilePic: null});
    }

    return (
        <div>
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
          <label htmlFor="cuisine">Cuisine(s):</label>
          <select name="cuisine" id="cuisine" value="ChefProfile.cuisine" onChange={handleChange}> 
            <option value="italian">Italian</option> 
            <option value="indian">Indian</option> 
            <option value="thai">Thai</option> 
            <option value="greek">Greek</option> 
          </select>
          {/* <input
            type="text"
            name="cuisine"
            id="cuisine"
            value={profile.cuisine}
            onChange={handleChange}
          /> */}
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
          {location.pathname === "/profile" && (
            <input type="button" value="Submit" onClick={submitProfile} />)}
        </form>
        </div>
      );
}

export default ChefProfile;