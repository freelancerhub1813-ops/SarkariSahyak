import React, { useState } from "react";
import { FaFileAlt, FaCalendarAlt } from "react-icons/fa";
import "../styles/SchemeCard.css";
import SchemeDetailsModal from "./SchemeDetailsModal";

function SchemeCard({ scheme }) {
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [openApplyDirect, setOpenApplyDirect] = useState(false);
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
    if (!dateString) return null;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleApply = (e) => {
    e.stopPropagation();
    const userEmail = localStorage.getItem('email');
    if (!userEmail) { setError('Please login to apply for schemes'); }
    setOpenApplyDirect(true);
    setShowDetails(true);
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
          {formatDate(scheme.created_at) && (
            <span className="scheme-date">
              <FaCalendarAlt /> Added: {formatDate(scheme.created_at)}
            </span>
          )}
          
          <div className="scheme-actions">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <button 
              className="apply-btn" 
              onClick={handleApply}
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
      {showDetails && (
        <SchemeDetailsModal schemeId={scheme.id} onClose={() => { setShowDetails(false); setOpenApplyDirect(false); }} initialApplyOpen={openApplyDirect} />
      )}
    </div>
  );
}

export default SchemeCard;