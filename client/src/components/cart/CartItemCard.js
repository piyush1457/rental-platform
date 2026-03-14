import React from 'react';
import { Trash2 } from 'lucide-react';
import DurationSelector from './DurationSelector';
import './CartComponents.css';

const CartItemCard = ({ item, index, updateDuration, removeFromCart }) => {
  const handleDurationChange = (newDuration) => {
    updateDuration(index, newDuration);
  };

  return (
    <div className="rk-cart-item-card">
      <div className="rk-cart-item-image-wrapper">
        <img src={item.image} alt={item.name} className="rk-cart-item-image" />
      </div>
      
      <div className="rk-cart-item-details">
        <div className="rk-cart-item-header">
          <h3 className="rk-cart-item-name">{item.name}</h3>
          <p className="rk-cart-item-price">₹{item.price} <span className="rk-price-period">/ day</span></p>
        </div>
        
        <div className="rk-cart-item-actions">
          <DurationSelector 
            duration={item.duration} 
            onChange={handleDurationChange} 
          />
          
          <div className="rk-cart-item-subtotal">
            <span className="rk-subtotal-label">Subtotal</span>
            <span className="rk-subtotal-value">₹{item.price * item.duration}</span>
          </div>
        </div>
      </div>

      <button 
        className="rk-cart-item-remove" 
        onClick={() => removeFromCart(index)}
        aria-label="Remove item"
        title="Remove item"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default CartItemCard;
