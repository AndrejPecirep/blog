import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="fade-in">
      <div className="container flex justify-between items-center">
        <Link to="/" className="nav-logo">MyBlog</Link>
        <nav className="flex gap-4">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-btn-primary">Register</Link>
        </nav>
      </div>
    </header>
  );
}
