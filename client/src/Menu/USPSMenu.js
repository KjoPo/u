import React, { useState } from 'react';
import { FiSearch, FiMenu, FiX } from 'react-icons/fi';
import './USPSMenu.css';

const USPSMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="usps-header">
      <div className="usps-header-container">
        <div className="mobile-top-bar">
          <img 
            src="/images/logo-sb.jpg" 
            alt="USPS Logo" 
            className="logo"
          />
          <div className="mobile-controls">
            <button 
              className="search-toggle" 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              {isSearchOpen ? <FiX size={24} /> : <FiSearch size={24} />}
            </button>
            <button 
              className="menu-toggle" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="mobile-search-container">
            <input 
              type="text" 
              placeholder="Search USPS.com" 
              className="mobile-search-input"
            />
            <button className="mobile-search-button">
              <FiSearch size={20} />
            </button>
          </div>
        )}

        <nav className={`usps-nav ${isMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="usps-nav-list">
            <li className="usps-nav-item quick-tools-wrapper">
              <a href="#" className="usps-nav-link quick-tools-link">
                <span>Quick Tools</span>
              </a>
              <div className="red-strip"></div>
            </li>
            <li className="usps-nav-item"><a href="#" className="usps-nav-link">Mail & Ship</a></li>
            <li className="usps-nav-item"><a href="#" className="usps-nav-link">Track & Manage</a></li>
            <li className="usps-nav-item"><a href="#" className="usps-nav-link">Postal Store</a></li>
            <li className="usps-nav-item"><a href="#" className="usps-nav-link">Business</a></li>
            <li className="usps-nav-item"><a href="#" className="usps-nav-link">Informational</a></li>
            <li className="usps-nav-item"><a href="#" className="usps-nav-link">Help</a></li>
            <li className="usps-nav-item search-icon-item desktop-only">
              <FiSearch className="search-icon" />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default USPSMenu;
