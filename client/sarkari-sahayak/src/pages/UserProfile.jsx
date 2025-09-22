import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaCamera, FaSave, FaArrowLeft, FaEdit, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import '../styles/UserProfile.css';

function UserProfile() {
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: '',
    profile_photo: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const userEmail = localStorage.getItem('email');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    setLoading(true);
    setError(null);
    axios.get(`http://localhost:9000/user-profile/${userEmail}`)
      .then((res) => {
        if (res.data) {
          const prof = res.data;
          // Normalize stored photo path to absolute URL if it's a relative /files path
          let photo = prof.profile_photo || null;
          if (photo && photo.startsWith('/files')) {
            photo = `http://localhost:9000${photo}`;
          }
          setProfile({ ...prof, profile_photo: photo || '' });
          setImagePreview(photo);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile. Please try again later.");
        setLoading(false);
      });
  };

  const handleImageError = () => {
    // If an absolute URL failed, try prefixing localhost backend; else clear preview
    if (profile.profile_photo && profile.profile_photo.startsWith('/files')) {
      const fallback = `http://localhost:9000${profile.profile_photo}`;
      setImagePreview(fallback);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Prefer uploading to server via multer and storing returned path
      const form = new FormData();
      form.append('photo', file);
      form.append('user_email', userEmail);
      form.append('user_name', (profile.full_name && profile.full_name.trim()) ? profile.full_name.trim() : (userEmail ? userEmail.split('@')[0] : 'user'));

      axios.post('http://localhost:9000/upload/photo', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then((res) => {
        const url = res.data?.path;
        if (url) {
          setImagePreview(url);
          setProfile(prev => ({ ...prev, profile_photo: url }));
        } else {
          // Fallback to base64 preview if server didn't return a path
          const reader = new FileReader();
          reader.onload = (ev) => {
            setImagePreview(ev.target.result);
            setProfile(prev => ({ ...prev, profile_photo: ev.target.result }));
          };
          reader.readAsDataURL(file);
        }
      }).catch(() => {
        // On upload error, still let user preview with base64 so they can save
        const reader = new FileReader();
        reader.onload = (ev) => {
          setImagePreview(ev.target.result);
          setProfile(prev => ({ ...prev, profile_photo: ev.target.result }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const startEditing = () => {
    setSuccess('');
    setError(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setSuccess('');
    setError(null);
    loadProfile();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess('');

    const profileData = {
      user_email: userEmail,
      full_name: profile.full_name,
      phone: profile.phone,
      address: profile.address,
      profile_photo: profile.profile_photo
    };

    axios.post('http://localhost:9000/user-profile', profileData)
      .then(() => {
        setSuccess('Profile updated successfully!');
        localStorage.setItem('userProfile', JSON.stringify(profile));
        setIsEditing(false);
        setSaving(false);
      })
      .catch((err) => {
        console.error("Failed to save profile:", err);
        setError("Failed to save profile. Please try again later.");
        setSaving(false);
      });
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <FaUser className="loading-icon" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <Link to="/dashboard" className="back-button">
          <FaArrowLeft /> Back to Dashboard
        </Link>
        <h1>My Profile</h1>
        <p>View and manage your personal information</p>
      </div>

      <div className="profile-content">
        <div className="profile-photo-section">
          <div className="photo-container">
            {imagePreview ? (
              <img src={imagePreview} alt="Profile" className="profile-photo" onError={handleImageError} />
            ) : (
              <div className="profile-photo-placeholder">
                <FaUser />
              </div>
            )}
            {isEditing && (
              <>
                <label htmlFor="photo-upload" className="photo-upload-btn">
                  <FaCamera />
                  <span>Change Photo</span>
                </label>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </>
            )}
          </div>
          <div className="user-info">
            <h2>{profile.full_name || 'Your Name'}</h2>
            <p>{userEmail}</p>
          </div>
        </div>

        {!isEditing ? (
          <div className="profile-view">
            <div className="view-row">
              <label>Full Name</label>
              <div className="view-value">{profile.full_name || '-'}</div>
            </div>
            <div className="view-row">
              <label>Phone Number</label>
              <div className="view-value">{profile.phone || '-'}</div>
            </div>
            <div className="view-row">
              <label>Address</label>
              <div className="view-value">{profile.address || '-'}</div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button className="edit-btn" onClick={startEditing}>
              <FaEdit /> Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="full_name">Full Name</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={profile.full_name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={profile.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                rows="4"
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={cancelEditing}>
                <FaTimes /> Cancel
              </button>
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? (
                  <>
                    <FaSave className="spinning" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserProfile;