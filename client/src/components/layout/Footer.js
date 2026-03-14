// src/components/layout/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="rk-footer">
      <div className="rk-footer-container">
        <div className="rk-footer-top">
          
          {/* Brand Column */}
          <div className="rk-footer-col brand-col">
            <h2 className="rk-footer-logo">RentKaro</h2>
            <p className="rk-footer-desc">
              Your go-to platform for flexible and affordable rentals. Rent what you need, when you need it.
            </p>
            <div className="rk-social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Links Columns */}
          <div className="rk-footer-col">
            <h4 className="rk-footer-title">Company</h4>
            <ul className="rk-footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className="rk-footer-col">
            <h4 className="rk-footer-title">Support</h4>
            <ul className="rk-footer-links">
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/track">Track Order</Link></li>
            </ul>
          </div>
          
          <div className="rk-footer-col">
            <h4 className="rk-footer-title">Legal</h4>
            <ul className="rk-footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/cancellation">Cancellation Policy</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="rk-footer-bottom">
          <p>&copy; {new Date().getFullYear()} RentKaro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
