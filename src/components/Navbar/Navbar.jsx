import React, { useState, useEffect } from 'react';
import { FaCartArrowDown, FaSearch, FaUser, FaTimes } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import './Navbar.css';


function Navbar({ searchQuery, setSearchQuery }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profile, setProfile] = useState({ name: '', email: '' });

  const navigate = useNavigate();

  const goToCart = () => {
    navigate('/cart');
  };
  // Toggle profile card
  const toggleProfileCard = () => {
    setIsProfileOpen(!isProfileOpen);
    setChangePasswordMode(false);
  };

  // Fetch user profile when profile card is opened
  useEffect(() => {
    if (isProfileOpen) {
      const token = localStorage.getItem('token');
      fetch('http://localhost:5001/api/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setProfile({ name: data.name, email: data.email });
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
        });
    }
  }, [isProfileOpen]);

  // Change password logic
  const handleChangePassword = () => {
    if (newPassword === confirmPassword) {
      const token = localStorage.getItem('token');
      fetch('http://localhost:5001/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      })
        .then(response => response.json())
        .then(data => {
          alert('Password updated successfully!');
          setChangePasswordMode(false);
        })
        .catch(error => {
          console.error('Error updating password:', error);
        });
    } else {
      alert('New passwords do not match');
    }
  };

  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login page
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <h2><span className="logo-highlight">WatchNow</span></h2>
        </div>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search Movie Name from here"
            className="search-input"
            value={searchQuery} // Bind the search query to the input field
            onChange={(e) => setSearchQuery(e.target.value)} // Update the query on input change
          />
        </div>
        <div className="nav-links">
          <ul className="navbar-links">
            <li><a href="/home">Movies</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>
        <div className="navbar-icons">
          <FaUser onClick={toggleProfileCard} />
          <div className="heart-icon-wrapper">
            <FaCartArrowDown className="cart-icon" onClick={goToCart} />
            <div className="notification-bubble">0</div>
          </div>
        </div>
      </nav>

      {/* Profile Card */}
      {isProfileOpen && (
        <div className="profile-card-overlay">
          <div className="profile-card">
            {/* Close Button */}
            <button className="close-btn" onClick={toggleProfileCard}>
              <FaTimes />
            </button>
            <div className="profile-icon-wrapper">
              <FaUser className="profile-icon" />
            </div>
            <h3>{profile.name}</h3>
            <p>{profile.email}</p>

            {/* Buttons in the same row */}
            <div className="profile-actions">
              <button className="change-password-btn" onClick={() => setChangePasswordMode(!changePasswordMode)}>
                Change Password
              </button>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            {/* If Change Password is clicked, show input fields */}
            {changePasswordMode && (
              <div className="change-password-form">
                <input
                  type="password"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button className="submit-btn" onClick={handleChangePassword}>Change Password</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
