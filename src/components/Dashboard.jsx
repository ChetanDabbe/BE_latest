import React from 'react';
import "../styles/dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard-main">
      <div className="dashboard-card">
        <p className="card-title">Inspection Rate</p>
        <div className="card-value">
          <h4 className="card-number">120</h4>
          <span className="card-unit">bottles/min</span>
        </div>
      </div>

      <div className="dashboard-card">
        <p className="card-title">Pass Rate</p>
        <h4 className="card-number">86.4%</h4>
      </div>

      <div className="dashboard-card">
        <p className="card-title">Today's Count</p>
        <h4 className="card-number">45,823</h4>
      </div>

      <div className="dashboard-card">
        <p className="card-title">Defects Today</p>
        <h4 className="card-number">127</h4>
      </div>
    </div>
  );
}

export default Dashboard;
