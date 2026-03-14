// src/components/home/CallToActionSection.js
import React from 'react';
import { ArrowRight } from 'lucide-react';
import './CallToActionSection.css';

const CallToActionSection = () => {
  return (
    <section className="rk-cta-section">
      <div className="rk-cta-container">
        <div className="rk-cta-content">
          <h2 className="rk-cta-title">Start Renting Today</h2>
          <p className="rk-cta-desc">
            Browse hundreds of premium products available for flexible rental. Upgrade your lifestyle without breaking the bank.
          </p>
          <button className="rk-btn rk-btn-primary rk-cta-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Explore Products
            <ArrowRight size={20} className="rk-btn-icon" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
