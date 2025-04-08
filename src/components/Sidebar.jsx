import React from 'react';
import '../styles/sidebar.css';
import { FiActivity, FiCamera, FiClock, FiFileText, FiSettings } from 'react-icons/fi';

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-icon"><FiActivity /></div>
      <div className="sidebar-icon"><FiCamera /></div>
      <div className="sidebar-icon"><FiClock /></div>
      <div className="sidebar-icon"><FiFileText /></div>
      <div className="sidebar-icon"><FiSettings /></div>
    </div>
  );
}

export default Sidebar;
