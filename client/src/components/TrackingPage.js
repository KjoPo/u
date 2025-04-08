import React from 'react';
import './TrackingPage.css';

const TrackingPage = () => {
  return (
    <div className="tracking-container">
      <div className="tracking-header-container">
        <div className="tracking-header-left">
          <h1>USPS Tracking<sup>®</sup></h1>
          <button className="track-button">
            Track Another Package <span className="red-plus">+</span>
          </button>
        </div>
        <div className="tracking-header-right">
          <span className="faq-tracking-link">
            <span className="tracking-text">Tracking</span>
            <span className="slash"> / </span>
            FAQs
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
