// src/components/home/HeroSection.js
import React from 'react';
import './HeroSection.css';
import HeroProductCard from './HeroProductCard';

const HeroSection = () => {
  return (
    <section className="rk-hero">
      <div className="rk-hero-container">
        <div className="rk-hero-content">
          <span className="rk-hero-badge">Smart Renting Platform</span>
          <h1 className="rk-hero-title">
            Rent What You Need,<br />
            <span className="rk-hero-highlight">When You Need It.</span>
          </h1>
          <p className="rk-hero-subtitle">
            Affordable, flexible rentals for electronics, appliances, and more.
            Experience premium products without the premium price tag.
          </p>
          <div className="rk-hero-actions">
            <button className="rk-btn rk-btn-primary" onClick={() => {
              document.getElementById('explore-categories')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Browse Products
            </button>
            <button className="rk-btn rk-btn-secondary" onClick={() => {
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              How It Works
            </button>
          </div>
        </div>
        <div className="rk-hero-visual">
          <div className="rk-visual-circle rk-circle-1"></div>
          <div className="rk-visual-circle rk-circle-2"></div>
          <div className="rk-visual-card">
            <div className="rk-visual-card-inner">
              <div className="rk-mock-img"></div>
              <div className="rk-mock-lines">
                <div className="rk-mock-line"></div>
                <div className="rk-mock-line short"></div>
              </div>
              <div className="rk-mock-btn"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
