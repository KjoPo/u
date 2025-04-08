import React from 'react';
import './FAQSection.css';

const FAQSection = () => {
  return (
    <div className="faq-section-wrapper">
      <div className="faq-container">
        <div className="faq-content">
          <h2 className="faq-title">Can't find what you're looking for?</h2>
          <p className="faq-text">Go to our FAQs section to find answers to your tracking questions.</p>
          <div className="faq-button-container">
            <button className="faq-button">FAQs</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
