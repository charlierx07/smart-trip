import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <div className="logo">Smart Trip</div>
        <ul className="nav-links">
          <li>Home</li>
          <li>About</li>
          <li>Plans</li>
          <li>Contact</li>
        </ul>
        <button className="login-btn">Login with Google</button>
      </nav>
    </div>
  );
};

export default Navbar;
