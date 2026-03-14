// src/components/home/ProductCard.js
import React, { useState } from 'react';
import { X } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product, onRent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Use a default image if none provided
  const imageSrc = product.image || 'https://via.placeholder.com/300x200?text=Product+Image';
  const price = product.price || 0;

  const handleImageClick = (e) => {
    // Prevent opening modal if the Rent Now button is clicked
    if (e.target.closest('.rk-rent-btn')) return;
    setIsModalOpen(true);
  };

  const closeModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="rk-product-card">
        <div className="rk-product-image-container" onClick={handleImageClick}>
          <img src={imageSrc} alt={product.name} className="rk-product-image" loading="lazy" />
          <div className="rk-product-overlay">
            <button className="rk-rent-btn" onClick={(e) => {
              e.stopPropagation();
              if (onRent) onRent(product);
            }}>
              Rent Now
            </button>
          </div>
        </div>
      
        <div className="rk-product-info">
          <div className="rk-product-header">
            <h3 className="rk-product-name" title={product.name}>{product.name}</h3>
          </div>
          
          <div className="rk-product-footer">
            <div className="rk-product-price">
              <span className="amount">₹{price}</span>
              <span className="duration">/day</span>
            </div>
          </div>
        </div>
      </div>

      {/* Image Enlargement Modal */}
      {isModalOpen && (
        <div className="rk-product-modal-backdrop" onClick={closeModal}>
          <div className="rk-product-modal-content" onClick={e => e.stopPropagation()}>
            <button className="rk-product-modal-close" onClick={closeModal}>
              <X size={24} />
            </button>
            <img src={imageSrc} alt={product.name} className="rk-product-modal-image" />
            <div className="rk-product-modal-info">
              <h3>{product.name}</h3>
              <p>₹{price} / day</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
