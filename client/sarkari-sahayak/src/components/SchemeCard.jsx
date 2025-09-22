import React, { useState } from "react";
import { FaFileAlt, FaCalendarAlt, FaCheck, FaSpinner } from "react-icons/fa";
import axios from "axios";
import "../styles/SchemeCard.css";
import SchemeDetailsModal from "./SchemeDetailsModal";

function SchemeCard({ scheme }) {
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const getCategoryDisplayName = (cat) => {
    const names = {
      agriculture: "Agriculture",
      banking: "Banking", 
      business: "Business",
      education: "Education",
      health: "Health",
      it_science: "IT & Science",
      women: "Women"
    };
    return names[cat] || cat;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleApply = async (e) => {
    // prevent triggering card onClick
    e.stopPropagation();
    const userEmail = localStorage.getItem('email');
    if (!userEmail) {
      setError('Please login to apply for schemes');
      return;
    }

    setApplying(true);
    setError(null);

    try {
      await axios.post('http://localhost:9000/apply-scheme', {
        user_email: userEmail,
        scheme_id: scheme.id,
        applied_documents: scheme.documents || '',
        application_notes: `Applied for ${scheme.name}`
      });

      setApplied(true);
      // Update localStorage to refresh applied schemes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('Failed to apply for scheme:', err);
      setError('Failed to apply for scheme. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div
      className="scheme-card"
      onClick={() => setShowDetails(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') setShowDetails(true);
      }}
      aria-label={`Open details for ${scheme?.name || 'scheme'}`}
    >
      <div className="scheme-header">
        <h3 className="scheme-title">{scheme.name}</h3>
        <span className="scheme-category">{getCategoryDisplayName(scheme.category)}</span>
      </div>
      
      <div className="scheme-content">
        <p className="scheme-description">{scheme.basic_info}</p>
        
        {scheme.documents && scheme.documents.trim() && (
          <div className="scheme-documents">
            <h4><FaFileAlt /> Required Documents:</h4>
            <ul>
              {scheme.documents.split(",").map((doc, index) => (
                <li key={index}>{doc.trim()}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="scheme-footer">
          <span className="scheme-date">
            <FaCalendarAlt /> Added: {formatDate(scheme.created_at)}
          </span>
          
          <div className="scheme-actions">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            {applied ? (
              <button className="apply-btn applied" disabled>
                <FaCheck />
                Applied Successfully
              </button>
            ) : (
              <button 
                className="apply-btn" 
                onClick={handleApply}
                disabled={applying}
              >
                {applying ? (
                  <>
                    <FaSpinner className="spinning" />
                    Applying...
                  </>
                ) : (
                  'Apply Now'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      {showDetails && (
        <SchemeDetailsModal schemeId={scheme.id} onClose={() => setShowDetails(false)} />
      )}
    </div>
  );
}

export default SchemeCard;