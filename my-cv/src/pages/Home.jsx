import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-overlay">
        <div className="hero-content">
          <h1>Build Your Professional CV</h1>
          <p>
            Create and update your CV in minutes by simply uploading your information.
            Our modern and user-friendly interface helps you craft a standout CV that
            highlights your skills and experience.
          </p>
          <div className="button-group">
            <Link to="/public-cv" className="btn btn-primary">
              Check My CV
            </Link>
            <Link to="/dashboard" className="btn btn-secondary">
              Make My CV
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
