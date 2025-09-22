import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaCalendarAlt, FaCheckCircle, FaClock, FaTimesCircle, FaEye } from 'react-icons/fa';
import axios from 'axios';
import '../styles/AppliedSchemes.css';

function AppliedSchemes() {
  const [appliedSchemes, setAppliedSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userEmail = localStorage.getItem('email');

  useEffect(() => {
    loadAppliedSchemes();
  }, []);

  const loadAppliedSchemes = () => {
    setLoading(true);
    setError(null);
    
    axios.get(`http://localhost:9000/applied-schemes/${userEmail}`)
      .then((res) => {
        setAppliedSchemes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load applied schemes:", err);
        setError("Failed to load applied schemes. Please try again later.");
        setLoading(false);
      });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="status-icon approved" />;
      case 'rejected':
        return <FaTimesCircle className="status-icon rejected" />;
      case 'under_review':
        return <FaEye className="status-icon under-review" />;
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'under_review':
        return 'Under Review';
      default:
        return 'Pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="applied-schemes-container">
        <div className="schemes-loading">
          <FaFileAlt className="loading-icon" />
          <p>Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applied-schemes-container">
        <div className="schemes-error">
          <p>{error}</p>
          <button onClick={loadAppliedSchemes} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="applied-schemes-container">
      <div className="schemes-header">
        <h2>My Applications</h2>
        <p>Track the status of your scheme applications</p>
      </div>

      {appliedSchemes.length === 0 ? (
        <div className="no-applications">
          <FaFileAlt className="no-applications-icon" />
          <h3>No Applications Yet</h3>
          <p>You haven't applied for any schemes yet. Browse available schemes to get started!</p>
        </div>
      ) : (
        <div className="applications-list">
          {appliedSchemes.map((application) => (
            <div key={application.id} className="application-card">
              <div className="application-header">
                <div className="scheme-info">
                  <h3 className="scheme-name">{application.scheme_name}</h3>
                  <span className="scheme-category">{application.scheme_category}</span>
                </div>
                <div className="application-status">
                  {getStatusIcon(application.application_status)}
                  <span className={`status-text ${application.application_status}`}>
                    {getStatusText(application.application_status)}
                  </span>
                </div>
              </div>

              <div className="application-content">
                <p className="scheme-description">{application.scheme_info}</p>
                
                {application.applied_documents && (
                  <div className="applied-documents">
                    <h4><FaFileAlt /> Documents Submitted:</h4>
                    <p>{application.applied_documents}</p>
                  </div>
                )}

                {application.application_notes && (
                  <div className="application-notes">
                    <h4>Notes:</h4>
                    <p>{application.application_notes}</p>
                  </div>
                )}

                <div className="application-dates">
                  <div className="date-item">
                    <FaCalendarAlt />
                    <span>Applied: {formatDate(application.applied_at)}</span>
                  </div>
                  {application.updated_at !== application.applied_at && (
                    <div className="date-item">
                      <FaCalendarAlt />
                      <span>Updated: {formatDate(application.updated_at)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppliedSchemes;
