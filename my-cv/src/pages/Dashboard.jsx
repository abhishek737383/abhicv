import React, { useState } from 'react';
import PersonalForm from '../components/cv/PersonalForm';
import EducationForm from '../components/cv/EducationForm';
import ExperienceForm from '../components/cv/ExperienceForm';
import SkillsForm from '../components/cv/SkillsForm';
import HobbiesForm from '../components/cv/HobbiesForm';
import ProjectsForm from '../components/cv/ProjectsForm';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {  
  // State for secret key protection
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');

  // Change this to your desired secret key or load from env variable.
  const CORRECT_SECRET = 'abhi123';

  const handleSecretSubmit = (e) => {
    e.preventDefault();
    if (secretKey === CORRECT_SECRET) {
      setIsAuthorized(true);
    } else {
      setError('Incorrect secret key. Please try again.');
    }
  };

  // If not authorized, show the secret key form
  if (!isAuthorized) {
    return (
      <div className="dashboard-secret">
        <h2>Enter Secret Key to Access the Dashboard</h2>
        <form onSubmit={handleSecretSubmit}>
          <input
            type="password"
            placeholder="Secret Key"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="secret-input"
          />
          <button type="submit" className="secret-btn">
            Submit
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    );
  }

  // Function to delete all CV data.
  const handleDeleteAll = async () => {
    if (window.confirm("Are you sure you want to delete all data? This action cannot be undone.")) {
      try {
        await api.delete('/cv'); // Ensure your backend supports this endpoint.
        // Reload the page to update all states.
        window.location.reload();
      } catch (error) {
        console.error("Error deleting all data", error);
        alert("Error deleting all data.");
      }
    }
  };

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      
      {/* Delete All Data Button */}
      <button onClick={handleDeleteAll} className="delete-all-button">
        Delete All Data
      </button>

      <section className="dashboard-section">
        <h2>Personal Information</h2>
        <PersonalForm />
      </section>

      <section className="dashboard-section">
        <h2>Education</h2>
        <EducationForm />
      </section>

      <section className="dashboard-section">
        <h2>Experience</h2>
        <ExperienceForm />
      </section>

      <section className="dashboard-section">
        <h2>Skills</h2>
        <SkillsForm />
      </section>

      <section className="dashboard-section">
        <h2>Hobbies</h2>
        <HobbiesForm />
      </section>

      <section className="dashboard-section">
        <h2>Projects</h2>
        <ProjectsForm />
      </section>
    </div>
  );
};

export default Dashboard;
