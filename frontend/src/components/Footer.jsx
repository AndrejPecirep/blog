import React from 'react';

export default function Footer() {
  return (
    <footer className="fade-in">
      &copy; {new Date().getFullYear()} MyBlog. All rights reserved.
    </footer>
  );
}