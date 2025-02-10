import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Alert from '../layout/Alert';

/**
 * Form component to update personal details and upload a profile picture.
 */
const PersonalForm = () => {
  // Local state for personal data and feedback messages
  const [personal, setPersonal] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    image: '' // this will hold the image URL from the backend (if any)
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('https://via.placeholder.com/150');
  const [message, setMessage] = useState(null);

  // Load existing personal info on mount
  useEffect(() => {
    const fetchPersonal = async () => {
      try {
        const res = await api.get('/cv');
        if (res.data.personal) {
          setPersonal(res.data.personal);
        }
      } catch (error) {
        console.error('Error fetching personal info:', error);
      }
    };
    fetchPersonal();
  }, []);

  // Update the preview image when a file is selected or when personal.image is updated
  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      // Clean up the URL object when the component unmounts or when the file changes
      return () => URL.revokeObjectURL(objectUrl);
    } else if (personal.image) {
      setPreview(personal.image);
    } else {
      setPreview('https://via.placeholder.com/150');
    }
  }, [selectedFile, personal.image]);

  /**
   * Handle file input change.
   */
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  /**
   * Handle form submission to update personal info and upload a picture.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a FormData instance and append all personal fields
      const formData = new FormData();
      formData.append('fullName', personal.fullName);
      formData.append('email', personal.email);
      formData.append('phone', personal.phone);
      formData.append('address', personal.address);
      formData.append('bio', personal.bio);
      // Append the image file if a new file has been selected
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const res = await api.put('/cv/personal', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Update the personal state with the response data
      setPersonal(res.data);
      setMessage('Personal information updated successfully.');
      // Clear the selected file after a successful update
      setSelectedFile(null);
    } catch (error) {
      console.error('Error updating personal info:', error);
      setMessage('Error updating personal information.');
    }
  };

  return (
    <div>
      <h3>Personal Details</h3>
      {message && (
        <Alert 
          message={message} 
          type={message.includes('Error') ? 'error' : 'success'} 
        />
      )}

      {/* Profile Picture Preview */}
      <div className="profile-section">
        <img
          src={preview}
          alt={personal.fullName || personal.name || 'Profile'}
          className="profile-pic"
        />
      </div>

      <form onSubmit={handleSubmit}>
        <label htmlFor="image">Upload Profile Picture</label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleFileChange}
        />

        <label htmlFor="fullName">Full Name</label>
        <input 
          type="text" 
          id="fullName" 
          value={personal.fullName}
          onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
          required
        />

        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          id="email" 
          value={personal.email}
          onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
          required
        />

        <label htmlFor="phone">Phone</label>
        <input 
          type="text" 
          id="phone" 
          value={personal.phone}
          onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
          required
        />

        <label htmlFor="address">Address</label>
        <input 
          type="text" 
          id="address" 
          value={personal.address}
          onChange={(e) => setPersonal({ ...personal, address: e.target.value })}
          required
        />

        <label htmlFor="bio">Bio</label>
        <textarea 
          id="bio" 
          value={personal.bio}
          onChange={(e) => setPersonal({ ...personal, bio: e.target.value })}
        />

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default PersonalForm;
