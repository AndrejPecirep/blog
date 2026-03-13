import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar fade-in">
      <Link to="/" className="nav-logo">MyBlog</Link>

      <div className="flex gap-4">
        {user ? (
          <>
            <Link to="/profile" className="nav-link">
              {user.username}
            </Link>

            {/* ✅ ISPRAVLJENA RUTA */}
            <Link to="/create" className="nav-link">
              Create Post
            </Link>

            <button onClick={logout} className="nav-btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
