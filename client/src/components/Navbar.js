import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <h2 className="text-gradient">SmartTracker</h2>
      </div>

      <div className="user-info">
        <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <div className="details">
          <p className="name">{user?.name}</p>
          <p className="role">{user?.role}</p>
        </div>
      </div>

      <nav className="nav-links">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <span className="icon">📊</span>
          Dashboard
        </NavLink>
        <NavLink to="/applications" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <span className="icon">📁</span>
          Applications
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          <span className="icon">👤</span>
          Profile
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button className="btn btn-outline logout-btn" onClick={logout}>
          <span className="icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Navbar;
