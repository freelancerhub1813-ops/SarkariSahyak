import React, { useState } from "react";
import AdminNavBar from "../components/AdminNavBar";
import AdminSidebar from "../components/AdminSidebar";
import UserPanel from "../components/UserPanel";
import SchemesPanel from "../components/SchemesPanel";
import NotificationPanel from "../components/NotificationPanel";
import DashboardPanel from "../components/DashboardPanel";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const renderContent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <DashboardPanel />;
      case "Users":
        return <UserPanel />;
      case "Schemes":
        return <SchemesPanel />;
      case "Notifications":
        return <NotificationPanel />;
      default:
        return <DashboardPanel />;
    }
  };

  return (
    <div>
      <AdminNavBar />
      <div className="admin-layout">
        <AdminSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
        <main className="admin-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;