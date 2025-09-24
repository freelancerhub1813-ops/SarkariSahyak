import { Link, Routes, Route, useLocation } from "react-router-dom";
import { 
  FaLeaf, FaUniversity, FaChartLine, FaGraduationCap, 
  FaHeartbeat, FaAtom, FaFemale, FaUser, FaKey, FaListUl
} from "react-icons/fa";
import "../styles/dashboard.css";
import { useI18n } from "../contexts/I18nContext";

import Agriculture from "./Agriculture";
import Banking from "./Banking";
import Business from "./Business";
import Education from "./Education";
import Health from "./Health";
import ITScience from "./ITScience";
import Women from "./Women";

function Dashboard() {
  const { t } = useI18n();
  const location = useLocation();
  const isDashboardHome = location.pathname === "/dashboard";
  const userEmail = localStorage.getItem("email") || "User";

  const sections = [
    { name: t("dashboard.sections.agriculture"), path: "agriculture", icon: <FaLeaf className="dashboard-icon icon-green" /> },
    { name: t("dashboard.sections.banking"), path: "banking", icon: <FaUniversity className="dashboard-icon icon-blue" /> },
    { name: t("dashboard.sections.business"), path: "business", icon: <FaChartLine className="dashboard-icon icon-orange" /> },
    { name: t("dashboard.sections.education"), path: "education", icon: <FaGraduationCap className="dashboard-icon icon-purple" /> },
    { name: t("dashboard.sections.health"), path: "health", icon: <FaHeartbeat className="dashboard-icon icon-red" /> },
    { name: t("dashboard.sections.it_science"), path: "itscience", icon: <FaAtom className="dashboard-icon icon-teal" /> },
    { name: t("dashboard.sections.women"), path: "women", icon: <FaFemale className="dashboard-icon icon-pink" /> },
  ];

  return (
    <div className="dashboard-container">
      {isDashboardHome && (
        <>
          <div className="dashboard-header">
            <div className="dashboard-hero">
              <h1 className="dashboard-title">{t("dashboard.title")}</h1>
              <p className="dashboard-subtitle">{t("dashboard.welcome", { name: userEmail })}</p>
            </div>

            <div className="quick-actions">
              <Link to="/profile" className="qa-btn">
                <FaUser />
                <span>{t("dashboard.profile")}</span>
              </Link>
              <Link to="/changepassword" className="qa-btn">
                <FaKey />
                <span>{t("dashboard.changePassword")}</span>
              </Link>
              <Link to="/applications" className="qa-btn">
                <FaListUl />
                <span>{t("dashboard.myApplications")}</span>
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