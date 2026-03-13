import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link to="/" className="brand-mark">
          <span className="brand-badge">B</span>
          <span>
            <strong>BlogStudio</strong>
            <small>modern publishing platform</small>
          </span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          {isAuthenticated && <NavLink to="/create">New Post</NavLink>}
          {isAuthenticated && <NavLink to="/profile">Profile</NavLink>}
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <div className="user-chip">{user?.username}</div>
              <button onClick={logout} className="button button-secondary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="button button-ghost">Login</Link>
              <Link to="/register" className="button button-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
