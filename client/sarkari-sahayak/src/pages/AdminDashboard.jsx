import React, { useState } from "react";
import AdminNavBar from "../components/AdminNavBar";
import AdminSidebar from "../components/AdminSidebar";
import UserPanel from "../components/UserPanel";
import SchemesPanel from "../components/SchemesPanel";
import NotificationPanel from "../components/NotificationPanel";
import ApplicationsPanel from "../components/ApplicationsPanel";
import DashboardPanel from "../components/DashboardPanel";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <DashboardPanel />;
      case "Users":
        return <UserPanel />;
      case "Schemes":
        return <SchemesPanel />;
      case "Applications":
        return <ApplicationsPanel />;
      case "Notifications":
        return <NotificationPanel />;

      default:
        return <DashboardPanel />;
    }
  };

  return (
    <div>
      <AdminNavBar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <div className={`admin-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <AdminSidebar
          activeMenu={activeMenu}
          setActiveMenu={(val) => { setActiveMenu(val); setSidebarOpen(false); }}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="admin-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;