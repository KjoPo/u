import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="usps-footer">
      <div className="footer-container">
        <div className="footer-columns">
          {/* First Column */}
          <div className="footer-column">
            <h3 className="footer-heading">HELPFUL LINKS</h3>
            <h4 className="footer-subheading">Contact Us</h4>
            <ul className="footer-links">
              <li><a href="/site-index">Site Index</a></li>
              <li><a href="/faqs">FAQs</a></li>
              <li><a href="/feedback">Feedback</a></li>
            </ul>
          </div>

          {/* Second Column */}
          <div className="footer-column">
            <h3 className="footer-heading">ABOUT USPS.COM</h3>
            <ul className="footer-links">
              <li><a href="/usd">About USPS Home</a></li>
              <li><a href="/about">Newsroom</a></li>
              <li><a href="/about">USPS Service Update</a></li>
              <li><a href="/important">Forms & Publications</a></li>
              <li><a href="/important">Government Services</a></li>
              <li><a href="/important">Careers</a></li>
            </ul>
          </div>

          {/* Third Column */}
          <div className="footer-column">
            <h3 className="footer-heading">OTHER USPS SITES</h3>
            <h4 className="footer-subheading">Business Customer Gateway</h4>
            <ul className="footer-links">
              <li><a href="/postal-inspection">Postal Inspectors</a></li>
              <li><a href="/inspired-product">Inspector General</a></li>
              <li><a href="/inspired-product">Postal Explorer</a></li>
              <li><a href="/inspired-product">National Postal Museum</a></li>
              <li><a href="/inspired-product">Resources for Developers</a></li>
            </ul>
          </div>

          {/* Fourth Column */}
          <div className="footer-column">
            <h3 className="footer-heading">LEGAL INFORMATION</h3>
            <ul className="footer-links">
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Use</a></li>
              <li><a href="/faq">FOIA</a></li>
              <li><a href="/faq">No FEAR Act EEO Data</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-copyright">
          <p>Copyright © 2024 USPS. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
