// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection';
import CategorySection from '../components/home/CategorySection';
import MostRentedSection from '../components/home/MostRentedSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import CallToActionSection from '../components/home/CallToActionSection';
import './HomePage.css';

const staticProducts = [
  {
    _id: 'static-1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality wireless headphones for music and calls.',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=200&fit=crop',
    price: 15
  },
  {
    _id: 'static-2',
    name: 'Gaming Mouse',
    description: 'Ergonomic gaming mouse with RGB lighting.',
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=300&h=200&fit=crop',
    price: 10
  },
  {
    _id: 'static-3',
    name: 'Portable Charger',
    description: 'Fast-charging power bank for your devices.',
    image: 'https://m.media-amazon.com/images/I/71tsTZoDenL._AC_SL1500_.jpg',
    price: 12
  },
  {
    _id: 'static-4',
    name: 'Smartphone Stand',
    description: 'Adjustable stand for phones and tablets.',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=200&fit=crop',
    price: 8
  },
  {
    _id: 'static-5',
    name: 'USB-C Cable',
    description: 'Durable USB-C charging cable.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    price: 5
  },
  {
    _id: 'static-6',
    name: 'Laptop Cooling Pad',
    description: 'Keep your laptop cool during use.',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=200&fit=crop',
    price: 18
  }
];

function HomePage() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayTitle, setDisplayTitle] = useState('Most Rented This Week');

  const fetchProducts = async (query = 'electronics', isDefault = false) => {
    setLoading(true);
    if (isDefault) {
      setDisplayTitle('Most Rented This Week');
    } else {
      setDisplayTitle(`Search Results for "${query}"`);
    }

    try {
      console.log(`Searching Amazon for: ${query}`);
      const response = await fetch(`http://localhost:5000/api/amazon/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products. Falling back to static products.', error);
      setProducts(staticProducts); // Fallback to static products
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load static products by default
    setProducts(staticProducts);
    setLoading(false);
    // Optionally try to fetch from API in background
    fetchProducts('best sellers electronics', true).catch(() => {
      // If fetch fails, keep static products
    });
  }, []);

  const handleSearch = (query) => {
    // Scroll to products section smoothly
    const productsSection = document.getElementById('most-rented-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
    fetchProducts(query, false);
  };

  const handleRent = (product) => {
    addToCart(product);
    navigate('/cart');
  };

  return (
    <div className="rk-page">
      <Navbar onSearch={handleSearch} />
      
      <main className="rk-main-content">
        <HeroSection />
        
        <div id="most-rented-section">
          <MostRentedSection 
            title={displayTitle}
            products={products} 
            loading={loading} 
            onRent={handleRent}
          />
        </div>
        
        <CategorySection onCategoryClick={handleSearch} />
        <HowItWorksSection />
        <CallToActionSection />
      </main>
      
      <Footer />
    </div>
  );
}

export default HomePage;
