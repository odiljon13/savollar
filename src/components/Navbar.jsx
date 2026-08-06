import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/home" className="nav-brand">
          <span className="nav-brand-icon">🧠</span>
          <span className="nav-brand-text">Logic Quest Pro</span>
        </Link>
        <div className="nav-links">
          <Link to="/home" className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`}>🏠 Bosh sahifa</Link>
          {isAdmin && <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>⚙️ Admin</Link>}
        </div>
        <div className="nav-user">
          {isAdmin && <span className="nav-admin-badge">Admin</span>}
          <span className="nav-user-name">{user?.firstName}</span>
          <button className="nav-logout-btn" onClick={handleLogout}>Chiqish</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
