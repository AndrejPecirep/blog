import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>BlogStudio</h3>
          <p>A professional blog focused on content, speed, and a modern user experience.</p>
        </div>
        <div>
          <h4>What's New</h4>
          <p>Search, tags, comments, profile editing, and an attractive responsive design.</p>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} BlogStudio</div>
    </footer>
  );
}
