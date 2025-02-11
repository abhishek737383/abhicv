import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Ensure this file returns your CV data
import { faPhone, faEnvelope, faMapMarker, faDownload, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './PublicCV.css';

const PublicCV = () => {
  // State for CV data
  const [cvData, setCvData] = useState({
    personal: {},
    education: [],
    experience: [],
    projects: [],
    skills: [],
    languages: [],
    certifications: [],
    hobbies: [],
    social: {} // e.g., { website: 'https://yourwebsite.com', linkedin: 'https://linkedin.com/in/username' }
  });
  
  // States for managing loading, slow responses, and errors
  const [loading, setLoading] = useState(true);
  const [slowMsg, setSlowMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Function to fetch CV data from the API
  const fetchCV = async () => {
    try {
      const res = await api.get('/cv');
      setCvData({
        personal: res.data.personal || {},
        education: res.data.education || [],
        experience: res.data.experience || [],
        projects: res.data.projects || [],
        skills: res.data.skills || [],
        languages: res.data.languages || [],
        certifications: res.data.certifications || [],
        hobbies: res.data.hobbies || [],
        social: (res.data.personal && res.data.personal.social) || {}
      });
      // Clear any previous error or slow messages if fetch is successful.
      setErrorMsg('');
      setSlowMsg('');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching CV data:', error);
      setErrorMsg('Error fetching CV data. Please try again later.');
      setLoading(false);
    }
  };

  // Fetch CV data on mount and poll every 30 seconds.
  useEffect(() => {
    fetchCV();
    const interval = setInterval(fetchCV, 30000);
    return () => clearInterval(interval);
  }, []);

  // Timer to display a "slow response" message after 5 seconds.
  useEffect(() => {
    if (loading) {
      const slowTimer = setTimeout(() => {
        if (loading) {
          setSlowMsg("The server is taking longer than usual to respond. Please wait...");
        }
      }, 5000);
      return () => clearTimeout(slowTimer);
    }
  }, [loading]);

  // Timer to display an error message after 50 seconds of waiting.
  useEffect(() => {
    if (loading) {
      const errorTimer = setTimeout(() => {
        if (loading) {
          setErrorMsg("Server is taking too long to respond. Please try refreshing the page.");
          setLoading(false);
        }
      }, 50000);
      return () => clearTimeout(errorTimer);
    }
  }, [loading]);

  // Helper function to format date range (showing only years).
  const formatDateRange = (start, end) => {
    if (!start) return '';
    const startYear = new Date(start).getFullYear();
    if (end) {
      const endYear = new Date(end).getFullYear();
      return `${startYear} - ${endYear}`;
    }
    return `${startYear} - Present`;
  };
  const handleDownloadPDF = () => {
    // Select the original CV wrapper element
    const originalElement = document.querySelector('.cv-premium-wrapper');
    
    // Clone the element to avoid modifying the on-screen version
    const clone = originalElement.cloneNode(true);
  
    // Force desktop styling on the clone
    clone.classList.add('force-desktop');
    clone.style.width = '1200px';      // Force a desktop width
    clone.style.maxWidth = 'none';
    
    // Remove the PDF download button from the clone so it doesn't appear in the PDF
    const pdfButton = clone.querySelector('.pdf-button-container');
    if (pdfButton) {
      pdfButton.remove();
    }
    
    // Position the clone off-screen so it does not affect the layout
    clone.style.position = 'absolute';
    clone.style.top = '-10000px';
    clone.style.left = '0';
    document.body.appendChild(clone);
  
    // Use html2canvas to capture the clone with a high scale (for HD quality)
    html2canvas(clone, {
      scale: 7,               // High scale for HD quality (adjust as needed)
      useCORS: true,          // Enable cross-origin images
      backgroundColor: '#fff' // Ensure a white background
    }).then(canvas => {
      // Convert the canvas to an image
      const imgData = canvas.toDataURL('image/jpeg', 1);
      
      // Create a jsPDF instance with A4 page size in portrait mode
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
  
      // Calculate the image dimensions for the PDF
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const imgWidth = pdfWidth;
      const imgHeight = pdfWidth / ratio;
  
      // If the content fits on one page, add it directly; otherwise, split into multiple pages.
      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      } else {
        let position = 0;
        let heightLeft = imgHeight;
    
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
    
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
      }
      
      // Save the PDF file
      pdf.save('CV.pdf');
  
      // Clean up: remove the off-screen clone from the document
      document.body.removeChild(clone);
      
      alert("PDF downloaded successfully!");
    }).catch(err => {
      console.error("Error generating PDF:", err);
      // Clean up the clone even if there’s an error
      document.body.removeChild(clone);
    });
  };
  
  
      
  
  // Destructure the CV data for easy access.
  const {
    personal,
    education,
    experience,
    projects,
    skills,
    languages,
    certifications,
    hobbies,
    social
  } = cvData;

  // Display a loading message (with a slow response note) until data is available.
  if (loading) {
    return (
      <div className="loading">
        <p>Loading...</p>
        {slowMsg && <p className="slow-msg">{slowMsg}</p>}
      </div>
    );
  }

  // Display an error message if fetching data fails.
  if (errorMsg) {
    return (
      <div className="error">
        <p>{errorMsg}</p>
      </div>
    );
  }

  return (
    <div className="cv-premium-wrapper">
      <div className="cv-container">
        {/* Sidebar */}
        <aside className="cv-premium-sidebar">
          <div className="profile-section">
            <img
              src={personal.image || 'https://via.placeholder.com/150'}
              alt={personal.fullName || personal.name || 'Profile'}
              className="profile-pic"
              crossOrigin="anonymous"  // Key for proper PDF rendering
            />
            <h1 className="profile-name">{personal.fullName || personal.name}</h1>
            <h2 className="profile-title">{personal.title}</h2>
            <p className="profile-summary">{personal.bio || personal.summary}</p>
          </div>
          <div className="contact-section sidebar-section">
            <h3>Contact</h3>
            <ul className="contact-list">
              {personal.phone && (
                <li>
                  <FontAwesomeIcon icon={faPhone} />
                  <span>{personal.phone}</span>
                </li>
              )}
              {personal.email && (
                <li>
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>{personal.email}</span>
                </li>
              )}
              {personal.address && (
                <li>
                  <FontAwesomeIcon icon={faMapMarker} />
                  <span>{personal.address}</span>
                </li>
              )}
              {social.website && (
                <li>
                  <FontAwesomeIcon icon={faGlobe} />
                  <span>
                    <a href={social.website} target="_blank" rel="noopener noreferrer">
                      Website
                    </a>
                  </span>
                </li>
              )}
              {social.linkedin && (
                <li>
                  <FontAwesomeIcon icon={faGlobe} />
                  <span>
                    <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                  </span>
                </li>
              )}
            </ul>
          </div>
          {skills && skills.length > 0 && (
            <div className="skills-section sidebar-section">
              <h3>Skills</h3>
              <div className="skills-grid">
                {skills.map((skill, index) => (
                  <span key={index} className="skill-badge">
                    {skill.name}{skill.level ? ` - ${skill.level}` : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
          {languages && languages.length > 0 && (
            <div className="languages-section sidebar-section">
              <h3>Languages</h3>
              <ul className="languages-list">
                {languages.map((lang, index) => (
                  <li key={index}>
                    {lang.name} ({lang.level})
                  </li>
                ))}
              </ul>
            </div>
          )}
          {certifications && certifications.length > 0 && (
            <div className="certifications-section sidebar-section">
              <h3>Certifications</h3>
              <ul className="certifications-list">
                {certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </div>
          )}
          {hobbies && hobbies.length > 0 && (
            <div className="hobbies-section sidebar-section">
              <h3>Hobbies</h3>
              <div className="hobbies-grid">
                {hobbies.map((hobby, index) => (
                  <span key={index} className="hobby-badge">{hobby}</span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="cv-premium-content">
          {/* Education Section */}
          <section className="section education-section">
            <h2>Education</h2>
            {education.map((edu, index) => (
              <div key={index} className="card education-card">
                <p>
                  <strong>Degree:</strong> {edu.degree}
                </p>
                {edu.fieldOfStudy && (
                  <p>
                    <strong>Field of Study:</strong> {edu.fieldOfStudy}
                  </p>
                )}
                <p>
                  <strong>School:</strong> {edu.school}
                </p>
                <p>
                  <strong>Duration:</strong>{' '}
                  {edu.startDate ? formatDateRange(edu.startDate, edu.endDate) : ''}
                </p>
                {edu.description && (
                  <p>
                    <strong>Description:</strong> {edu.description}
                  </p>
                )}
              </div>
            ))}
          </section>

          {/* Experience Section */}
          <section className="section experience-section">
            <h2>Experience</h2>
            {experience.map((exp, index) => (
              <div key={index} className="card experience-card">
                <p>
                  <strong>Position:</strong> {exp.position}
                </p>
                <p>
                  <strong>Company:</strong> {exp.company}
                </p>
                <p>
                  <strong>Duration:</strong>{' '}
                  {exp.startDate ? formatDateRange(exp.startDate, exp.endDate) : ''}
                </p>
                <p>
                  <strong>Description:</strong> {exp.description}
                </p>
              </div>
            ))}
          </section>

          {/* Projects Section */}
          <section className="section projects-section">
            <h2>Projects</h2>
            {projects.length > 0 ? (
              projects.map((proj, index) => (
                <div key={index} className="card project-card">
                  <p>
                    <strong>Title:</strong> {proj.title}
                  </p>
                  {proj.description && (
                    <p>
                      <strong>Description:</strong> {proj.description}
                    </p>
                  )}
                  {Array.isArray(proj.details) && proj.details.length > 0 && (
                    <div>
                      <strong>Details:</strong>
                      <ul className="project-details">
                        {proj.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No projects available.</p>
            )}
          </section>
        </main>
      </div>

      {/* Download Button */}
      <div className="pdf-button-container">
        <button onClick={handleDownloadPDF} className="pdf-download-btn">
          <FontAwesomeIcon icon={faDownload} /> Download PDF
        </button>
      </div>
    </div>
  );
};

export default PublicCV;
