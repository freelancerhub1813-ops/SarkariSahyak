import { Link, Routes, Route, useLocation } from "react-router-dom";
import { 
  FaLeaf, FaUniversity, FaChartLine, FaGraduationCap, 
  FaHeartbeat, FaAtom, FaFemale, FaUser, FaKey, FaListUl
} from "react-icons/fa";
import "../styles/dashboard.css";

import Agriculture from "./Agriculture";
import Banking from "./Banking";
import Business from "./Business";
import Education from "./Education";
import Health from "./Health";
import ITScience from "./ITScience";
import Women from "./Women";

function Dashboard() {
  const location = useLocation();
  const isDashboardHome = location.pathname === "/dashboard";
  const userEmail = localStorage.getItem("email") || "User";

  const sections = [
    { name: "Agriculture", path: "agriculture", icon: <FaLeaf className="dashboard-icon icon-green" /> },
    { name: "Banking", path: "banking", icon: <FaUniversity className="dashboard-icon icon-blue" /> },
    { name: "Business", path: "business", icon: <FaChartLine className="dashboard-icon icon-orange" /> },
    { name: "Education", path: "education", icon: <FaGraduationCap className="dashboard-icon icon-purple" /> },
    { name: "Health", path: "health", icon: <FaHeartbeat className="dashboard-icon icon-red" /> },
    { name: "IT & Science", path: "itscience", icon: <FaAtom className="dashboard-icon icon-teal" /> },
    { name: "Women", path: "women", icon: <FaFemale className="dashboard-icon icon-pink" /> },
  ];

  return (
    <div className="dashboard-container">
      {isDashboardHome && (
        <>
          <div className="dashboard-header">
            <div className="dashboard-hero">
              <h1 className="dashboard-title">सरकारी सहायक</h1>
              <p className="dashboard-subtitle">Welcome, {userEmail}</p>
            </div>

            <div className="quick-actions">
              <Link to="/profile" className="qa-btn">
                <FaUser />
                <span>My Profile</span>
              </Link>
              <Link to="/changepassword" className="qa-btn">
                <FaKey />
                <span>Change Password</span>
              </Link>
              <Link to="/applications" className="qa-btn">
                <FaListUl />
                <span>My Applications</span>
              </Link>
            </div>
          </div>

          <div className="dashboard-grid">
            {sections.map((section, index) => (
              <Link key={index} to={section.path} className="dashboard-card">
                {section.icon}
                <p className="dashboard-text">{section.name}</p>
              </Link>
            ))}
          </div>
        </>
      )}

      <Routes>
        <Route path="agriculture" element={<Agriculture />} />
        <Route path="banking" element={<Banking />} />
        <Route path="business" element={<Business />} />
        <Route path="education" element={<Education />} />
        <Route path="health" element={<Health />} />
        <Route path="itscience" element={<ITScience />} />
        <Route path="women" element={<Women />} />
      </Routes>
    </div>
  );
}

export default Dashboard;