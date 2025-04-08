import React from 'react';
import '../styles/defectDistribution.css';

function DefectDistribution() {
  return (
    <div className="defect-distribution-card">
      <h4 className="defect-title">Defect Distribution</h4>
      <div className="defect-item">
        <span className="defect-color defect-crack"></span>
        <span className="defect-label">Crack:</span>
        <span className="defect-count">23</span>
      </div>
      <div className="defect-item">
        <span className="defect-color defect-deformation"></span>
        <span className="defect-label">Deformation:</span>
        <span className="defect-count">12</span>
      </div>
    </div>
  );
}

export default DefectDistribution;
