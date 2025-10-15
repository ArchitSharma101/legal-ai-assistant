import React from 'react';
import './RiskMeter.css';

const RiskMeter = ({ riskLevel = 'low', riskScore = 0 }) => {
  // Calculate risk percentage based on level or score
  const getRiskPercentage = () => {
    if (typeof riskScore === 'number' && riskScore >= 0 && riskScore <= 100) {
      return riskScore;
    }

    switch (riskLevel.toLowerCase()) {
      case 'high': return 85;
      case 'medium': return 60;
      case 'low': return 25;
      default: return 50;
    }
  };

  const percentage = getRiskPercentage();
  const riskColor = percentage > 70 ? '#ff4444' : percentage > 40 ? '#ffaa00' : '#44ff44';

  return (
    <div className="risk-meter">
      <div className="risk-meter-header">
        <span className="risk-label">RISK LEVEL</span>
        <span className="risk-percentage">{percentage}%</span>
      </div>
      <div className="risk-meter-bar">
        <div
          className="risk-meter-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: riskColor,
            boxShadow: `0 0 10px ${riskColor}`
          }}
        />
        <div className="risk-meter-grid">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="grid-line" />
          ))}
        </div>
      </div>
      <div className="risk-levels">
        <span className="level low">LOW</span>
        <span className="level medium">MEDIUM</span>
        <span className="level high">HIGH</span>
      </div>
    </div>
  );
};

export default RiskMeter;
