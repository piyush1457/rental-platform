import React from 'react';
import { useCart } from '../../context/CartContext';
import './CartComponents.css';

const OrderSummaryCard = ({ placeOrder, handleGoHome, ordered }) => {
  const { cartItems } = useCart();
  
  const total = cartItems.reduce((sum, item) => sum + item.price * item.duration, 0);

  if (cartItems.length === 0 && !ordered) {
    return null;
  }

  return (
    <div className="rk-order-summary-card">
      <h3 className="rk-summary-title">Order Summary</h3>
      
      <div className="rk-summary-details">
        <div className="rk-summary-row">
          <span className="rk-summary-label">Items ({cartItems.length})</span>
          <span className="rk-summary-value">₹{total}</span>
        </div>
        
        {/* Optional delivery/tax could go here */}
        
        <hr className="rk-summary-divider" />
        
        <div className="rk-summary-row rk-summary-total-row">
          <span className="rk-summary-total-label">Total</span>
          <span className="rk-summary-total-value">₹{total}</span>
        </div>
      </div>

      <div className="rk-summary-actions">
        <button 
          className="rk-btn rk-btn-primary rk-summary-btn"
          onClick={placeOrder}
        >
          Place Order
        </button>
        <button 
          className="rk-btn rk-btn-outline rk-summary-btn rk-summary-clear-btn"
          onClick={handleGoHome}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
