import { useNavigate } from "react-router-dom";
import "../styles/AdminNavBar.css";

function AdminNavBar({ onToggleSidebar }) {
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLoggedIn");
    nav("/admin-login");
  };

  return (
    <nav className="admin-navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          &#9776;
        </button>
        <h2 className="logo">Sarkari Sahayak</h2>
      </div>
      <div className="navbar-right">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNavBar;