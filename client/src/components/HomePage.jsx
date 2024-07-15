// src/components/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Import your CSS file

// Import your sample image (assuming you have it in the right folder)
import sampleImage from '../assets/EMI.avif'; // Adjust the path based on your folder structure

function HomePage() {
  return (
    <div className="homepage">
      <header>
        <h1>Welcome to Event Management System</h1>
        <div className="button-container">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </header>
      <img src={sampleImage} alt="Sample" className="sample-image" />
    </div>
  );
}

export default HomePage;
