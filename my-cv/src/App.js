// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Dashboard from './pages/Dashboard';
import PublicCV from './pages/PublicCV';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/public-cv" element={<PublicCV />} />
            {/* Optionally, add an alias */}
            <Route path="/cv" element={<PublicCV />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
