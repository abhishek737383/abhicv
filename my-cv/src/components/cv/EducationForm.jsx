import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Alert from '../layout/Alert';

const EducationForm = () => {
  const [educationList, setEducationList] = useState([]);
  const [formData, setFormData] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  const [message, setMessage] = useState(null);

  // Fetch existing education entries on mount
  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await api.get('/cv');
        setEducationList(res.data.education || []);
      } catch (error) {
        console.error('Error fetching education:', error);
      }
    };
    fetchEducation();
  }, []);

  // Handle submission of education entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/cv/education', formData);
      setEducationList([...educationList, res.data]);
      setFormData({
        school: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        description: ''
      });
      setMessage('Education entry saved successfully.');
    } catch (error) {
      setMessage('Error saving education entry.');
    }
  };

  // Handle deleting an education entry
  const handleDeleteEducation = async (id) => {
    try {
      await api.delete(`/cv/education/${id}`);
      setEducationList(educationList.filter(edu => edu._id !== id));
      setMessage('Education entry deleted successfully.');
    } catch (error) {
      setMessage('Error deleting education entry.');
    }
  };

  return (
    <div>
      <h3>Education</h3>
      {message && (
        <Alert
          message={message}
          type={message.includes('Error') ? 'error' : 'success'}
        />
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="school">School</label>
        <input 
          type="text" 
          id="school" 
          value={formData.school}
          onChange={(e) => setFormData({ ...formData, school: e.target.value })}
          required
        />
        <label htmlFor="degree">Degree</label>
        <input 
          type="text" 
          id="degree" 
          value={formData.degree}
          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
          required
        />
        <label htmlFor="fieldOfStudy">Field of Study</label>
        <input 
          type="text" 
          id="fieldOfStudy" 
          value={formData.fieldOfStudy}
          onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
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
        <button type="submit">Save Education</button>
      </form>
      <div>
        <h4>Existing Education Entries</h4>
        <ul>
          {educationList.map((edu) => (
            <li key={edu._id}>
              <strong>{edu.degree}</strong> at {edu.school}
             
              <button className="delete-button" onClick={() => handleDeleteEducation(edu._id)}>
               Delete
               </button>

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EducationForm;
