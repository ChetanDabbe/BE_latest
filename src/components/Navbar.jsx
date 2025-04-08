import React from 'react';
import '../styles/navbar.css';

function Navbar() {
  return (
    <div className="navbar-main">
      <div className="nav-title">PET Bottle Quality Control</div>
      <div className="nav-info">
        <span className="status operational">✔ Operational</span>
        <span className="status">Line #3</span>
        <span className="status">Shift: Morning</span>
        <button className="emergency-button">Emergency Stop</button>
      </div>
    </div>
  );
}

export default Navbar;
