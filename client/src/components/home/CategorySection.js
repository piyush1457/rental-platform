// src/components/home/CategorySection.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Laptop, Gamepad2, Tv, Briefcase } from 'lucide-react';
import './CategorySection.css';

const categories = [
  { id: 'c1', name: 'Electronics', icon: Laptop, color: '#e0e7ff', iconColor: '#4f46e5' },
  { id: 'c2', name: 'Gaming', icon: Gamepad2, color: '#fce7f3', iconColor: '#db2777' },
  { id: 'c3', name: 'Home Appliances', icon: Tv, color: '#dcfce7', iconColor: '#16a34a' },
  { id: 'c4', name: 'Office Equipment', icon: Briefcase, color: '#fef3c7', iconColor: '#b45309' }
];

const CategorySection = ({ onCategoryClick }) => {
  return (
    <section className="rk-categories" id="explore-categories">
      <div className="rk-section-container">
        
        <div className="rk-section-header rk-header-split">
          <div>
            <h2 className="rk-section-title">Explore by Category</h2>
            <div className="rk-section-line"></div>
          </div>
          <Link to="/categories" className="rk-view-all">
            View All Categories
          </Link>
        </div>
        
        <div className="rk-category-grid">
          {categories.map(category => {
            const IconComponent = category.icon;
            return (
              <div 
                className="rk-category-card" 
                key={category.id} 
                onClick={() => onCategoryClick && onCategoryClick(category.name)}
                role="button"
                tabIndex={0}
              >
                <div 
                  className="rk-category-icon-wrapper" 
                  style={{ backgroundColor: category.color, color: category.iconColor }}
                >
                  <IconComponent size={32} />
                </div>
                <h3 className="rk-category-name">{category.name}</h3>
                <span className="rk-category-link">
                  Browse items
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
