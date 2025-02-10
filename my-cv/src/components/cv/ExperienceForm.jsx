import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Alert from '../layout/Alert';

const ExperienceForm = () => {
  const [experienceList, setExperienceList] = useState([]);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  const [message, setMessage] = useState(null);

  // Fetch existing experience entries on mount
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await api.get('/cv');
        setExperienceList(res.data.experience || []);
      } catch (error) {
        console.error('Error fetching experience:', error);
      }
    };
    fetchExperience();
  }, []);

  // Handle submission of experience entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/cv/experience', formData);
      setExperienceList([...experienceList, res.data]);
      setFormData({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
      });
      setMessage('Experience entry saved successfully.');
    } catch (error) {
      setMessage('Error saving experience entry.');
    }
  };

  // Handle deleting an experience entry
  const handleDeleteExperience = async (id) => {
    try {
      await api.delete(`/cv/experience/${id}`);
      setExperienceList(experienceList.filter(exp => exp._id !== id));
      setMessage('Experience entry deleted successfully.');
    } catch (error) {
      setMessage('Error deleting experience entry.');
    }
  };

  return (
    <div>
      <h3>Experience</h3>
      {message && (
        <Alert
          message={message}
          type={message.includes('Error') ? 'error' : 'success'}
        />
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="company">Company</label>
        <input 
          type="text" 
          id="company" 
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          required
        />
        <label htmlFor="position">Position</label>
        <input 
          type="text" 
          id="position" 
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          required
        />
        <label htmlFor="startDate">Start Date</label>
        <input 
          type="date" 
          id="startDate" 
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
        />
        <label htmlFor="endDate">End Date</label>
        <input 
          type="date" 
          id="endDate" 
          value={formData.endDate}
          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        />
        <label htmlFor="description">Description</label>
        <textarea 
          id="description" 
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <button type="submit">Save Experience</button>
      </form>
      <div>
        <h4>Existing Experience Entries</h4>
        <ul>
          {experienceList.map((exp) => (
            <li key={exp._id}>
              <strong>{exp.position}</strong> at {exp.company}
             

              <button className="delete-button" onClick={() => handleDeleteExperience(exp._id)}>
               Delete
               </button>


            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExperienceForm;
