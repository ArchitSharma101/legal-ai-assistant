import React from 'react';
import './progress.css';

const Progress = ({ value = 0, max = 100, className = '', showValue = false, size = 'medium' }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`progress-container ${className}`}>
      <div className={`progress-bar progress-${size}`}>
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <span className="progress-value">{Math.round(percentage)}%</span>
      )}
    </div>
  );
};

export default Progress;
