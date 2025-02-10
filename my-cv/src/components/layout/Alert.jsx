import React from 'react';

/**
 * Alert component for displaying messages.
 * @param {Object} props - Contains message and type (error, success, etc.)
 */
const Alert = ({ message, type = 'info' }) => {
  return (
    <div className={`alert alert-${type}`} style={{ padding: '10px', margin: '10px 0', borderRadius: '4px', background: type === 'error' ? '#f8d7da' : '#d4edda', color: type === 'error' ? '#721c24' : '#155724' }}>
      {message}
    </div>
  );
};

export default Alert;
