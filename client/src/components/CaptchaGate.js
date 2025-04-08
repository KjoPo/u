import React, { useState, useEffect } from 'react';
import './CaptchaGate.css';

const CaptchaGate = ({ onVerified }) => {
  const [captcha, setCaptcha] = useState({ question: '', answer: '' });
  const [userAnswer, setUserAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const generateCaptcha = () => {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const num1 =
      operation === '+' ? Math.floor(Math.random() * 10) + 1 :
      operation === '-' ? Math.floor(Math.random() * 10) + 6 :
      Math.floor(Math.random() * 5) + 1;
    const num2 =
      operation === '*' ? Math.floor(Math.random() * 5) + 1 :
      operation === '-' ? Math.floor(Math.random() * 5) + 1 :
      Math.floor(Math.random() * 10) + 1;
    const answer =
      operation === '+' ? num1 + num2 :
      operation === '-' ? num1 - num2 :
      num1 * num2;

    setCaptcha({ 
      question: `${num1} ${operation} ${num2}`, 
      answer: answer.toString() 
    });
    setUserAnswer('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!userAnswer.trim()) {
      setError('Please enter the CAPTCHA answer.');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      if (userAnswer.trim() === captcha.answer) {
        sessionStorage.setItem('captchaVerified', 'true');
        onVerified();
      } else {
        setError('Incorrect answer. Please try again.');
        generateCaptcha();
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="captcha-container">
      <header className="captcha-header">
        <h1 className="captcha-title">USPS Verification</h1>
      </header>
      
      <main className="captcha-main">
        <form onSubmit={handleSubmit} className="captcha-form">
          <h2 className="form-title">Human Verification Required</h2>
          <p className="form-description">
            Please solve this simple math problem to verify you're not a robot:
          </p>
          
          <div className={`captcha-challenge ${error ? 'error-shake' : ''}`}>
            <label className="captcha-label">
              Solve: <span className="captcha-question">{captcha.question} = ?</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={userAnswer}
              onChange={(e) => {
                setUserAnswer(e.target.value.replace(/[^0-9]/g, ''));
                if (error) setError('');
              }}
              required
              placeholder="Your answer"
              disabled={loading}
              className={`captcha-input ${error ? 'input-error' : ''}`}
              aria-label="CAPTCHA answer"
            />
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={generateCaptcha}
              className="refresh-button"
              disabled={loading}
              aria-label="Generate new CAPTCHA"
            >
              <span className="refresh-icon">↻</span> New Challenge
            </button>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="submit-button"
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Verifying...
                </>
              ) : 'Continue'}
            </button>
          </div>
        </form>
      </main>
      
      <footer className="captcha-footer">
        <p className="footer-text">
          © {new Date().getFullYear()} United States Postal Service. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default CaptchaGate;


