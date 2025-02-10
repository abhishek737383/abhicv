import api from './api';

/**
 * Function to handle user login.
 * Sends credentials to the backend and returns the response data.
 */
export const loginUser = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};
