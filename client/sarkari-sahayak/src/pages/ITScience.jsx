import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import SchemeCard from '../components/SchemeCard';
import '../styles/SchemeCard.css';

function ITScience() {
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSchemes();
  }, []);

  // Filter schemes when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSchemes(schemes);
    } else {
      const filtered = schemes.filter(scheme => 
        scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.basic_info.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (scheme.documents && scheme.documents.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredSchemes(filtered);
    }
  }, [schemes, searchTerm]);

  const loadSchemes = () => {
    setLoading(true);
    setError(null);
    
    axios.get("http://localhost:9000/schemes")
      .then((res) => {
        // Filter only IT & Science schemes
        const itScienceSchemes = res.data.filter(scheme => scheme.category === 'it_science');
        setSchemes(itScienceSchemes);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load schemes:", err);
        setError("Failed to load schemes. Please try again later.");
        setLoading(false);
      });
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <Link to="/dashboard" className="back-button">← Back to Dashboard</Link>
        <h1>IT & Science Schemes</h1>
        <p>Explore government schemes and programs for IT & Science sector.</p>
      </div>

      {/* Search Filter */}
      <div className="search-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search IT & Science schemes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={clearSearch}>
              <FaTimes />
            </button>
          )}
        </div>
        <div className="search-results">
          {searchTerm && (
            <p>
              {filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? 's' : ''} found
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          )}
        </div>
      </div>

      {loading && (
        <div className="schemes-loading">
          Loading IT & Science schemes...
        </div>
      )}

      {error && (
        <div className="schemes-error">
          {error}
        </div>
      )}

      {!loading && !error && schemes.length === 0 && (
        <div className="no-schemes">
          <h3>No IT & Science Schemes Available</h3>
          <p>There are currently no IT & Science schemes in our database.</p>
        </div>
      )}

      {!loading && !error && schemes.length > 0 && filteredSchemes.length === 0 && searchTerm && (
        <div className="no-schemes">
          <h3>No Schemes Found</h3>
          <p>No IT & Science schemes match your search for "{searchTerm}".</p>
          <button className="clear-search-btn" onClick={clearSearch}>
            Clear Search
          </button>
        </div>
      )}

      {!loading && !error && filteredSchemes.length > 0 && (
        <div className="schemes-container">
          <div className="schemes-header">
            <h2>
              Available IT & Science Schemes 
              {searchTerm ? `(${filteredSchemes.length} of ${schemes.length})` : `(${schemes.length})`}
            </h2>
          </div>
          <div className="schemes-list">
            {filteredSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ITScience;
