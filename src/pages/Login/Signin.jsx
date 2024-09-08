import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signin.css";

function Signin() {
    // State for Admin Login
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminErrorMessage, setAdminErrorMessage] = useState(''); // Error message for admin login

    // State for User Login
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userErrorMessage, setUserErrorMessage] = useState(''); // Error message for user login

    const navigate = useNavigate();

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setAdminErrorMessage(''); // Reset error message before each attempt
        try {
          const response = await axios.post('http://localhost:5001/admin', { email: adminEmail, password: adminPassword });
          localStorage.setItem('token', response.data.token); // Store JWT token
          navigate('/admin'); // Redirect to admin page
        } catch (error) {
          if (error.response && error.response.status === 400) {
            setAdminErrorMessage('Invalid email or password');
          } else {
            setAdminErrorMessage('An error occurred. Please try again.');
          }
          console.error('Error logging in as admin:', error);
        }
      };
      

    const handleUserLogin = async (e) => {
        e.preventDefault();
        setUserErrorMessage(''); // Reset error message before each attempt
        try {
            const response = await axios.post('http://localhost:5001/login', { email: userEmail, password: userPassword });
            localStorage.setItem('token', response.data.token); // Store JWT token
            navigate('/home'); // Redirect to home page
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setUserErrorMessage('Invalid email or password');
            } else {
                setUserErrorMessage('An error occurred. Please try again.');
            }
            console.error('Error logging in:', error);
        }
    };

    return (
        <div className="main">
            {/* Admin Login Section */}
            <div className="container-1">
                <h2>Admin</h2>
                <form onSubmit={handleAdminLogin}>
                    <div className="input-box1">
                        <label htmlFor="admin-email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="admin-email"
                            className="email"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-box1">
                        <label htmlFor="admin-password">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="admin-password"
                            className="email"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="sub-btn1">
                        Login
                    </button>
                    {adminErrorMessage && <p className="error">{adminErrorMessage}</p>} {/* Display admin login error */}
                </form>
                <p>Don't have an Account?</p>
                <Link to="/" className="next-btn1">
                    Sign Up
                </Link>
            </div>

            {/* User Login Section */}
            <div className="container-2">
                <h2>User Login</h2>
                <form onSubmit={handleUserLogin}>
                    <div className="input-box1">
                        <label htmlFor="user-email">
                            <strong>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="user-email"
                            className="email"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                        />
                    </div>
                    <div className="input-box1">
                        <label htmlFor="user-password">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="user-password"
                            className="email"
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="sub-btn1">
                        Login
                    </button>
                    {userErrorMessage && <p className="error">{userErrorMessage}</p>} {/* Display user login error */}
                </form>
                <p className="acc">Don't have an Account?</p>
                <Link to="/" className="next-btn1">
                    Sign Up
                </Link>
            </div>
        </div>
    );
}

export default Signin;
