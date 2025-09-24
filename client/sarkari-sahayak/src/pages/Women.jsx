import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import SchemeCard from '../components/SchemeCard';
import '../styles/SchemeCard.css';
import { useI18n } from '../contexts/I18nContext';
import { translateSchemes } from '../utils/translator';

function Women() {
  const { lang } = useI18n();
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSchemes();
  }, [lang]);

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

  const loadSchemes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:9000/schemes");
      const womenSchemes = res.data.filter(scheme => {
        const c = (scheme.category || '').toLowerCase();
        return c.includes('women') || c.includes('mahila') || c.includes('empower');
      });
      const localized = await translateSchemes(womenSchemes, lang);
      setSchemes(localized);
    } catch (err) {
      console.error("Failed to load schemes:", err);
      setError("Failed to load schemes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <Link to="/dashboard" className="back-button">← Back to Dashboard</Link>
        <h1>Women Schemes</h1>
        <p>Explore government schemes and programs for women empowerment.</p>
      </div>

      {/* Search Filter */}
      <div className="search-container">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search women schemes..."
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
          Loading women schemes...
        </div>
      )}

      {error && (
        <div className="schemes-error">
          {error}
        </div>
      )}

      {!loading && !error && schemes.length === 0 && (
        <div className="no-schemes">
          <h3>No Women Schemes Available</h3>
          <p>There are currently no women schemes in our database.</p>
        </div>
      )}

      {!loading && !error && schemes.length > 0 && filteredSchemes.length === 0 && searchTerm && (
        <div className="no-schemes">
          <h3>No Schemes Found</h3>
          <p>No women schemes match your search for "{searchTerm}".</p>
          <button className="clear-search-btn" onClick={clearSearch}>
            Clear Search
          </button>
        </div>
      )}

      {!loading && !error && filteredSchemes.length > 0 && (
        <div className="schemes-container">
          <div className="schemes-header">
            <h2>
              Available Women Schemes 
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

export default Women;
