import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import "../styles/NavBarprivate.css";

function NavBarPrivate({ setIsAuthenticated }) {
  const [open, setOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    // Load user profile from localStorage if available
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("userProfile");
    setIsAuthenticated(false); // update auth state
    nav("/login"); // redirect to login page
  };

  const goChangePassword = () => {
    setOpen(false); // close dropdown
    nav("/changepassword"); // navigate to Change Password page
  };

  const goProfile = () => {
    setOpen(false); // close dropdown
    nav("/profile"); // navigate to Profile page
  };

  return (
    <nav className="navbar">
      <h2 className="logo">Sarkari Sahayak</h2>
      <div className="dropdown">
        <button onClick={() => setOpen(!open)} className="dropbtn">
          <div className="profile-info">
            {userProfile?.profile_photo ? (
              <img 
                src={userProfile.profile_photo} 
                alt="Profile" 
                className="profile-avatar"
              />
            ) : (
              <div className="profile-avatar-placeholder">
                <FaUser />
              </div>
            )}
            <span className="profile-name">
              {userProfile?.full_name || localStorage.getItem("email")}
            </span>
            <span className="dropdown-arrow">⬇</span>
          </div>
        </button>
        {open && (
          <div className="dropdown-content">
            <div className="dropdown-item" onClick={goProfile}>
              <FaUser />
              <span>My Profile</span>
            </div>
            <div className="dropdown-item" onClick={goChangePassword}>
              <FaCog />
              <span>Change Password</span>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item logout" onClick={logout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBarPrivate;
