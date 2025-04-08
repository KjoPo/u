import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ currentStep }) => {
  const steps = [
    { id: 'address', label: 'Verify Address' },
    { id: 'payment', label: 'Payment Information' },
    { id: 'otp', label: 'OTP Verification' },
  ];

  // Calculate progress based on the current step
  const totalSteps = steps.length;
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div className="progress-bar-filled" style={{ width: `${progress}%` }}></div>
        <div className="progress-bar-unfilled"></div>
      </div>
      <p className="progress-bar-status">
        <span className="status-label">STATUS:</span>{' '}
        <span className="status-value">
          {currentStepIndex === 0 ? 'NOT AVAILABLE' : 'IN PROGRESS'}
        </span>
      </p>
    </div>
  );
};

export default ProgressBar;
