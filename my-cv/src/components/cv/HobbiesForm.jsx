import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Alert from '../layout/Alert';

const HobbiesForm = () => {
  const [hobbies, setHobbies] = useState([]);
  const [newHobby, setNewHobby] = useState('');
  const [message, setMessage] = useState(null);

  // Load existing hobbies on mount
  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const res = await api.get('/cv');
        if (res.data.hobbies) {
          setHobbies(res.data.hobbies);
        }
      } catch (error) {
        console.error('Error fetching hobbies:', error);
      }
    };
    fetchHobbies();
  }, []);

  const handleAddHobby = async (e) => {
    e.preventDefault();
    try {
      const updatedHobbies = [...hobbies, newHobby];
      // Assuming your API expects an object with a hobbies field
      await api.put('/cv/hobbies', { hobbies: updatedHobbies });
      setHobbies(updatedHobbies);
      setNewHobby('');
      setMessage('Hobbies updated successfully.');
    } catch (error) {
      setMessage('Error updating hobbies.');
    }
  };

  // Handle deleting an individual hobby
  const handleDeleteHobby = async (index) => {
    const updatedHobbies = hobbies.filter((_, i) => i !== index);
    try {
      await api.put('/cv/hobbies', { hobbies: updatedHobbies });
      setHobbies(updatedHobbies);
      setMessage('Hobby deleted successfully.');
    } catch (error) {
      setMessage('Error deleting hobby.');
    }
  };

  return (
    <div>
      <h3>Hobbies</h3>
      {message && (
        <Alert
          message={message}
          type={message.includes('Error') ? 'error' : 'success'}
        />
      )}
      <form onSubmit={handleAddHobby}>
        <label htmlFor="newHobby">Add Hobby</label>
        <input
          type="text"
          id="newHobby"
          value={newHobby}
          onChange={(e) => setNewHobby(e.target.value)}
          required
        />
        <button type="submit">Add Hobby</button>
      </form>
      {hobbies.length > 0 && (
        <ul>
          {hobbies.map((hobby, index) => (
            <li key={index}>
              {hobby}
             
              <button className="delete-button" onClick={() => handleDeleteHobby(index)}>
                     Delete
                </button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HobbiesForm;
