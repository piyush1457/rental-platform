import React from 'react';
import CartItemCard from './CartItemCard';
import { useCart } from '../../context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CartComponents.css';

const CartItemsList = () => {
  const { cartItems, updateDuration, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="rk-empty-cart">
        <div className="rk-empty-cart-icon-wrapper">
          <ShoppingBag size={48} className="rk-empty-cart-icon" />
        </div>
        <h2 className="rk-empty-cart-title">Your cart is empty</h2>
        <p className="rk-empty-cart-subtitle">Looks like you haven't added anything to your cart yet.</p>
        <button 
          className="rk-btn rk-btn-primary rk-empty-cart-btn"
          onClick={() => navigate('/')}
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="rk-cart-items-list">
      {cartItems.map((item, index) => (
        <CartItemCard 
          key={`${item._id}-${index}`} 
          item={item} 
          index={index}
          updateDuration={updateDuration}
          removeFromCart={removeFromCart}
        />
      ))}
    </div>
  );
};

export default CartItemsList;
