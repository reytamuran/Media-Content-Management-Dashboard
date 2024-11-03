// src/components/Header.js

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <header>
      <div className="logo">
        <Link to="/">
          <img src="/path/to/logo.png" alt="Logo" /> {/* Replace with your logo path */}
        </Link>
      </div>
      {!isLoginPage && (
        <nav>
          <Link to="/">Home</Link>
          <Link to="/create">Create Content</Link>
        </nav>
      )}
    </header>
  );
}

export default Header;
