import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import '../styles/SchemeCard.css';

function SchemeSearch({ 
  searchTerm, 
  setSearchTerm, 
  placeholder, 
  resultsCount, 
  totalCount 
}) {
  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="search-container">
      <div className="search-box">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button className="clear-search" onClick={clearSearch} title="Clear search">
            <FaTimes />
          </button>
        )}
      </div>
      {searchTerm && (
        <div className="search-results">
          <p>
            {resultsCount} scheme{resultsCount !== 1 ? 's' : ''} found
            {searchTerm && ` for "${searchTerm}"`}
            {totalCount && ` (${resultsCount} of ${totalCount})`}
          </p>
        </div>
      )}
    </div>
  );
}

export default SchemeSearch;