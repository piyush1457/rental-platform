import React from 'react';
import { Minus, Plus } from 'lucide-react';
import './CartComponents.css';

const DurationSelector = ({ duration, onChange }) => {
  const handleDecrement = () => {
    if (duration > 1) {
      onChange(duration - 1);
    }
  };

  const handleIncrement = () => {
    onChange(duration + 1);
  };

  return (
    <div className="rk-duration-selector">
      <span className="rk-duration-label">Duration (days)</span>
      <div className="rk-duration-controls">
        <button 
          className="rk-duration-btn" 
          onClick={handleDecrement}
          disabled={duration <= 1}
          aria-label="Decrease duration"
        >
          <Minus size={16} />
        </button>
        <span className="rk-duration-value">{duration}</span>
        <button 
          className="rk-duration-btn" 
          onClick={handleIncrement}
          aria-label="Increase duration"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default DurationSelector;
