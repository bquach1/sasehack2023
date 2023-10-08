// src/components/Profile.js
import React, { useState, useEffect } from "react";
import Overview from "./overview";
import NavBar from "../Navbar";
import "./overview.css";

// Import your profile picture (replace 'profile.jpg' with the actual file or URL)
import profileImage from "./logo192.png";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const mockUser = {
      name: "Insert name here",
      bio: "Insert description here",
    };

    setUser(mockUser);
  }, []);

  return (
    <div>
      <NavBar/>
      <div className="page-container">
        <div className="content-container">
          <div className="profile-and-overview-container">
            {user ? (
              <div className="profile-container">
                <div className="profile-info">
                  <div className="profile-picture">
                    <img src={profileImage} alt="Profile" />
                  </div>
                  <h2>{user.name}</h2>
                  <p>{user.bio}</p>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
            <div className="overview-container">
              <Overview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
