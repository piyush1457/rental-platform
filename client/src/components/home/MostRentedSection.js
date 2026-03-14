// src/components/home/MostRentedSection.js
import React from 'react';
import ProductCard from './ProductCard';
import './MostRentedSection.css';

const MostRentedSection = ({ products = [], loading = false, title = "", onRent }) => {
  return (
    <section className="rk-most-rented">
      <div className="rk-section-container">
        {title && (
          <div className="rk-section-header">
            <h2 className="rk-section-title">{title}</h2>
            <div className="rk-section-line"></div>
          </div>
        )}
        
        {loading ? (
          <div className="rk-loading-state">
            <div className="rk-spinner"></div>
            <p>Loading high-quality rental gear...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="rk-product-grid">
            {products.map(product => (
              <ProductCard 
                key={product._id || Math.random().toString()} 
                product={product} 
                onRent={onRent}
              />
            ))}
          </div>
        ) : (
          <div className="rk-empty-state">
            <p>No products available right now.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MostRentedSection;
