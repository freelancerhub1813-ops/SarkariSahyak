import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/auth.css';

function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (password === '') {
      toast.error('Password is required', { autoClose: 2000 });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (password === 'sem5@gmail.com') {
        localStorage.setItem('email', 'admin@sarkarisahayak.com');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('isLoggedIn', 'true');
        toast.success('Admin login successful!', { autoClose: 2000 });
        navigate('/admin-dashboard');
      } else {
        toast.error('Invalid admin password', { autoClose: 2000 });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <ToastContainer />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title"> Admin Access</h1>
            <h2 className="auth-subtitle">SarkariSahayak Admin Portal</h2>
            <p className="auth-description">Enter admin password to continue</p>
          </div>
          
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-group">
              <label htmlFor="password">Admin Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                disabled={isLoading}
              />
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Access Admin Panel'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>
              <a href="/roleselect" className="auth-link">← Back to Role Selection</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
