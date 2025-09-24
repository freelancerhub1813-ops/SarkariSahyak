import React from "react";
import { FaTachometerAlt, FaClipboardList } from "react-icons/fa";
import "../styles/admin.css"; 
const Sidebar = ({ activeMenu, setActiveMenu, open = false, onClose = () => {} }) => {
  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt /> },
    { name: "Schemes", icon: <FaClipboardList /> },
    { name: "Applications", icon: <FaClipboardList /> },
  ];

  return (
    <>
      {/* Backdrop for mobile when sidebar is open */}
      <div
        className={`sidebar-backdrop ${open ? 'show' : ''}`}
        onClick={onClose}
      />

      <div className={`admin-sidebar ${open ? 'open' : ''}`}>
        <h2>Admin Panel</h2>
        {menuItems.map((item) => (
          <a
            key={item.name}
            href="#"
            className={activeMenu === item.name ? "active" : ""}
            onClick={() => { setActiveMenu(item.name); onClose(); }}
          >
            <span style={{ marginRight: "10px" }}>{item.icon}</span>
            {item.name}
          </a>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
