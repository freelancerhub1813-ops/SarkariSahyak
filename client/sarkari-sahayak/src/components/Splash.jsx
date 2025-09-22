import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect after 3 seconds to role selection
    const timer = setTimeout(() => {
      navigate('/roleselect');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <div className="splash-logo">
          <div className="government-emblem">🏛️</div>
          <h1 className="splash-title">सरकारी सहायक</h1>
          <h2 className="splash-subtitle">SarkariSahayak</h2>
        </div>
        
        <div className="splash-loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default Splash;
