// src/components/layout/Navbar.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut, Package, MapPin, Settings } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const { cartItems = [] } = useCart() || {}; // Handle potential context missing
  const navigate = useNavigate();
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  
  // Close popovers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) && isSearchOpen) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target) && isProfileOpen) {
        setIsProfileOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    // Attempt to decode the JWT token manually to get user info without a dedicated backend fetch
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        if (decodedPayload && decodedPayload.email) {
          setUserEmail(decodedPayload.email);
        }
      }
    } catch (e) {
      console.error('Error decoding local token', e);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen, isProfileOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleCategoryClick = (e) => {
    e.preventDefault();
    const categorySection = document.getElementById('explore-categories');
    if (categorySection) {
      categorySection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/home');
      setTimeout(() => {
        document.getElementById('explore-categories')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleLogout = () => {
    // Remove the authentication token
    localStorage.removeItem('token');
    
    setIsProfileOpen(false);
    navigate('/login');
  };

  const getCartCount = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  return (
    <nav className="rk-navbar">
      <div className="rk-navbar-container">
        
        {/* Left: Logo */}
        <div className="rk-navbar-left">
          <Link to="/home" className="rk-logo">
            RentKaro
          </Link>
        </div>
        
        {/* Center: Navigation Links */}
        <div className="rk-navbar-center">
          <Link to="/home" className="rk-nav-link">Home</Link>
          <a href="#explore-categories" className="rk-nav-link" onClick={handleCategoryClick}>Categories</a>
          <Link to="/track" className="rk-nav-link">Track Order</Link>
        </div>
        
        {/* Right: Action Icons */}
        <div className="rk-navbar-right">
          
          {/* Search */}
          <div className={`rk-search-container ${isSearchOpen ? 'open' : ''}`} ref={searchRef}>
            <button 
              className="rk-icon-btn" 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              <Search size={22} strokeWidth={2} />
            </button>
            <form 
              className={`rk-search-form ${isSearchOpen ? 'expanded' : ''}`}
              onSubmit={handleSearchSubmit}
            >
              <input 
                type="text"
                className="rk-search-input"
                placeholder="Search products for rent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus={isSearchOpen}
              />
            </form>
          </div>
          
          {/* Cart */}
          <Link to="/cart" className="rk-icon-btn rk-cart-btn" aria-label="Cart">
            <ShoppingCart size={22} strokeWidth={2} />
            {getCartCount() > 0 && <span className="rk-cart-badge">{getCartCount()}</span>}
          </Link>
          
          {/* Profile Dropdown */}
          <div className="rk-profile-container" ref={profileRef}>
            <button 
              className={`rk-icon-btn ${isProfileOpen ? 'active' : ''}`}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-label="Profile"
            >
              <User size={22} strokeWidth={2} />
            </button>
            
            {isProfileOpen && (
              <div className="rk-profile-dropdown">
                <div className="rk-profile-header">
                  <div className="rk-profile-avatar">
                    <User size={24} color="var(--primary-accent)" />
                  </div>
                  <div className="rk-profile-info">
                    <h4 className="rk-profile-name">{userEmail ? userEmail.split('@')[0] : 'User'}</h4>
                    <p className="rk-profile-email">{userEmail || 'Guest'}</p>
                  </div>
                </div>
                
                <ul className="rk-profile-menu">
                  <li>
                    <Link to="/profile" className="rk-profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                      <Settings size={18} />
                      <span>My Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile?tab=orders" className="rk-profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                      <Package size={18} />
                      <span>My Orders</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile?tab=addresses" className="rk-profile-menu-item" onClick={() => setIsProfileOpen(false)}>
                      <MapPin size={18} />
                      <span>Addresses</span>
                    </Link>
                  </li>
                  <div className="rk-profile-divider"></div>
                  <li>
                    <button className="rk-profile-menu-item logout" onClick={handleLogout}>
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
