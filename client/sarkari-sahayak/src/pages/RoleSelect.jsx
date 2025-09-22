import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserShield, FaSpinner } from 'react-icons/fa';
import '../styles/roleselect.css';

function RoleSelect() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const selectRole = async (role) => {
    setLoading(true);
    // Add a small delay for better UX
    setTimeout(() => {
      if (role === 'user') {
        navigate('/login');
      } else if (role === 'admin') {
        navigate('/admin-login');
      }
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="role-container">
        <div className="loading-container">
          <FaSpinner className="spinner" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="role-container">
      <div className="role-card">
        <div className="role-header">
          <h1 className="role-title">सरकारी सहायक</h1>
          <h2 className="role-subtitle">SarkariSahayak</h2>
          <p className="role-description">Select your role to continue</p>
        </div>

        <div className="role-options">
          <div className="role-option user-option" onClick={() => selectRole('user')}>
            <div className="role-icon">
              <FaUser />
            </div>
            <h3>Citizen</h3>
            <p>Access government services</p>
          </div>

          <div className="role-option admin-option" onClick={() => selectRole('admin')}>
            <div className="role-icon">
              <FaUserShield />
            </div>
            <h3>Administrator</h3>
            <p>Manage the system</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelect;