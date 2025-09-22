import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Splash from './components/Splash';
import RoleSelect from './pages/RoleSelect';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ChangePassword from './pages/ChangePassword';
import UserProfile from './pages/UserProfile';
import NavBarPublic from './components/NavBarPublic';
import NavBarPrivate from './components/NavBarPrivate';
import AdminNavBar from './components/AdminNavBar';
import AppliedSchemes from './components/AppliedSchemes';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const email = localStorage.getItem("email");
    const admin = localStorage.getItem("isAdmin") === "true"; 
    setIsAuthenticated(!!email);
    setIsAdmin(admin);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  const publicOnlyRoutes = ["/", "/roleselect", "/login", "/signup"];

  let navbar = null;
  if (isAdmin && location.pathname.startsWith("/admin")) {
    navbar = <AdminNavBar setIsAdmin={setIsAdmin} />;
  } else if (!location.pathname.startsWith("/admin")) {
    if (publicOnlyRoutes.includes(location.pathname)) {
      navbar = <NavBarPublic />;
    } else {
      navbar = isAuthenticated ? (
        <NavBarPrivate setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <NavBarPublic />
      );
    }
  }

  return (
    <div className="app">
      {navbar}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Splash />} />
        <Route path="/roleselect" element={<RoleSelect />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route path="/admin-login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />

        {/* User Routes */}
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/applications" element={<AppliedSchemes />} />
      </Routes>
    </div>
  );
}

export default App;