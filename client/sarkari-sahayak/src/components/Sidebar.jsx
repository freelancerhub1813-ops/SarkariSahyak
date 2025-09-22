import React, { useState } from "react";
import { FaTachometerAlt, FaUsers, FaClipboardList, FaBell } from "react-icons/fa";
import "../styles/admin.css"; // Tula je CSS ahe te import kara

const Sidebar = ({ activeMenu, setActiveMenu }) => {
  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "Schemes", icon: <FaClipboardList /> },
    { name: "Notifications", icon: <FaBell /> },
  ];

  return (
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>
      {menuItems.map((item) => (
        <a
          key={item.name}
          href="#"
          className={activeMenu === item.name ? "active" : ""}
          onClick={() => setActiveMenu(item.name)}
        >
          <span style={{ marginRight: "10px" }}>{item.icon}</span>
          {item.name}
        </a>
      ))}
    </div>
  );
};

export default Sidebar;
