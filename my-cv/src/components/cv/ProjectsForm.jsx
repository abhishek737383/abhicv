import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Alert from '../layout/Alert';

const ProjectsForm = () => {
  const [project, setProject] = useState({
    title: '',
    description: '',
    details: ''
  });
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState(null);

  // Load existing projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/cv');
        // console.log("Projects fetched from API:", res.data.projects);
        if (res.data.projects) {
          setProjects(res.data.projects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert comma separated details into an array
      const detailsArray = project.details
        ? project.details.split(',').map((detail) => detail.trim())
        : [];
      const res = await api.post('/cv/project', { 
        title: project.title, 
        description: project.description, 
        details: detailsArray 
      });
      console.log("New project created:", res.data);
      setProjects([...projects, res.data]);
      setProject({ title: '', description: '', details: '' });
      setMessage('Project added successfully.');
    } catch (error) {
      console.error(error);
      setMessage('Error adding project.');
    }
  };

  // Handle deleting a project
  const handleDeleteProject = async (id) => {
    try {
      await api.delete(`/cv/project/${id}`);
      setProjects(projects.filter(proj => proj._id !== id));
      setMessage('Project deleted successfully.');
    } catch (error) {
      setMessage('Error deleting project.');
    }
  };

  return (
    <div>
      <h3>Projects</h3>
      {message && (
        <Alert
          message={message}
          type={message.includes('Error') ? 'error' : 'success'}
        />
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Project Title</label>
        <input
          type="text"
          id="title"
          value={project.title}
          onChange={(e) => setProject({ ...project, title: e.target.value })}
          required
        />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={project.description}
          onChange={(e) => setProject({ ...project, description: e.target.value })}
        />
        <label htmlFor="details">Details (comma separated)</label>
        <input
          type="text"
          id="details"
          value={project.details}
          onChange={(e) => setProject({ ...project, details: e.target.value })}
        />
        <button type="submit">Add Project</button>
      </form>
      {projects.length > 0 && (
        <div>
          <h4>Existing Projects:</h4>
          <ul>
            {projects.map((proj, index) => (
              <li key={proj._id || index}>
                <strong>{proj.title}</strong>: {proj.description}
                {proj.details && proj.details.length > 0 && (
                  <ul>
                    {proj.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                )}
            
                <button className="delete-button" onClick={() => handleDeleteProject(proj._id)}>
                 Delete
                </button>

              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProjectsForm;
