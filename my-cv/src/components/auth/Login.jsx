import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/auth';
import { AuthContext } from '../../context/authContext';
import Alert from '../layout/Alert';

/**
 * Login component to handle user login.
 */
const Login = () => {
  // Local state for form fields and error messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Access login function from AuthContext
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Handle form submission for login.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Attempt to log in with provided credentials
      const data = await loginUser(username, password);
      login(data.token);
      navigate('/dashboard');
    } catch (err) {
      // Set error message if login fails
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <Alert message={error} type="error" />}
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input 
          type="text" 
          id="username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          id="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
