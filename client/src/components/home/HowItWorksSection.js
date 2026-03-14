// src/components/home/HowItWorksSection.js
import React from 'react';
import { Search, CalendarDays, Truck } from 'lucide-react';
import './HowItWorksSection.css';

const steps = [
  {
    id: 1,
    title: 'Choose Product',
    description: 'Browse our extensive catalog and pick the items you need.',
    icon: Search
  },
  {
    id: 2,
    title: 'Select Duration',
    description: 'Choose your rental period, from a day to several months.',
    icon: CalendarDays
  },
  {
    id: 3,
    title: 'Get Delivered',
    description: 'Receive your items quickly at your doorstep. Hassle-free.',
    icon: Truck
  }
];

const HowItWorksSection = () => {
  return (
    <section className="rk-how-it-works" id="how-it-works">
      <div className="rk-section-container">
        <div className="rk-hiw-header">
          <h2 className="rk-section-title">How Renting Works</h2>
          <div className="rk-section-line centered"></div>
          <p className="rk-hiw-subtitle">
            Get your desired products in three simple steps.
          </p>
        </div>
        
        <div className="rk-hiw-steps">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <React.Fragment key={step.id}>
                <div className="rk-hiw-step">
                  <div className="rk-hiw-icon-wrapper">
                    <Icon size={36} strokeWidth={1.5} />
                    <div className="rk-hiw-number">{step.id}</div>
                  </div>
                  <h3 className="rk-hiw-step-title">{step.title}</h3>
                  <p className="rk-hiw-step-desc">{step.description}</p>
                </div>
                
                {/* Arrow Connector */}
                {index < steps.length - 1 && (
                  <div className="rk-hiw-connector">
                    <div className="rk-hiw-arrow"></div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
