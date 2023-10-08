// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import TodoList from './overview';
import NavBar from "../Navbar";
import "./overview.css"

// Import your profile picture (replace 'profile.jpg' with the actual file or URL)
import profileImage from './logo192.png';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user data from an API or database here
    // For simplicity, we'll use a mock user object
    const mockUser = {
      name: 'John Doe',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    };

    setUser(mockUser);
  }, []);

  return (
    <div className="profile">
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
      <TodoList />
    </div>
  );
};

export default Profile;
