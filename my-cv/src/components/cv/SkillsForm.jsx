import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Alert from '../layout/Alert';

const SkillsForm = () => {
  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [message, setMessage] = useState(null);

  // Fetch existing skills on mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/cv');
        setSkills(res.data.skills || []);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };
    fetchSkills();
  }, []);

  // Handle adding a new skill
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/cv/skill', { name: skillName, level: skillLevel });
      setSkills([...skills, res.data]);
      setSkillName('');
      setSkillLevel('');
      setMessage('Skill added successfully.');
    } catch (error) {
      setMessage('Error adding skill.');
    }
  };

  // Handle deleting a skill
  const handleDeleteSkill = async (id) => {
    try {
      await api.delete(`/cv/skill/${id}`);
      setSkills(skills.filter(skill => skill._id !== id));
      setMessage('Skill deleted successfully.');
    } catch (error) {
      setMessage('Error deleting skill.');
    }
  };

  return (
    <div>
      <h3>Skills</h3>
      {message && (
        <Alert
          message={message}
          type={message.includes('Error') ? 'error' : 'success'}
        />
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="skillName">Skill Name</label>
        <input 
          type="text" 
          id="skillName" 
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          required
        />
        <label htmlFor="skillLevel">Skill Level</label>
        <input 
          type="text" 
          id="skillLevel" 
          value={skillLevel}
          onChange={(e) => setSkillLevel(e.target.value)}
        />
        <button type="submit">Add Skill</button>
      </form>
      <div>
        <h4>Existing Skills</h4>
        <ul>
          {skills.map((skill) => (
            <li key={skill._id}>
              {skill.name} - {skill.level}
              <button className="delete-button" onClick={() => handleDeleteSkill(skill._id)}>
               Delete
              </button>

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SkillsForm;
