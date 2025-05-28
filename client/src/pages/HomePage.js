// src/pages/HomePage.js

import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './HomePage.css';


function HomePage() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const products = [
    {
      _id: "683089ec8930404b988da3cd",
      name: "Camera",
      description: "DSLR Camera for events",
      image: "https://x.imastudent.com/content/0035994_canon-eos-r7-mirrorless-camera-with-18-150mm-lens_500.jpeg",
      price: 500
    },
    {
      _id: "683089ec8930404b988da3ce",
      name: "Tent",
      description: "4-person camping tent",
      image: "https://t3.ftcdn.net/jpg/05/33/76/38/360_F_533763874_3JZruw5ZGXNrVS47ARY3oiEJ0ubrUvJC.jpg",
      price: 300
    },
    {
      _id: "683089ec8930404b988da3cf",
      name: "Projector",
      description: "HD projector for presentations",
      image: "https://t4.ftcdn.net/jpg/03/05/78/75/360_F_305787590_81F9C9BnkhTyU3730qPyInpQhH6SPHBN.jpg",
      price: 250
    },
    {
      _id: "683089ec8930404b988da3d0",
      name: "Speaker",
      description: "Bluetooth speaker",
      image: "https://pickurneeds.in/cdn/shop/products/0_1c6ce6d1-7469-4255-a72e-5665f9b10dd3.jpg?v=1665573422",
      price: 150
    },
    {
      _id: "683089ec8930404b988da3d1",
      name: "Bike",
      description: "Mountain bike for rent",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV-Mb8zjzIImAk3qr5DrWVSu42Vczsz5PxGA",
      price: 400
    },
    {
      _id: "683089ec8930404b988da3d2",
      name: "Laptop",
      description: "Gaming laptop",
      image: "https://m.media-amazon.com/images/I/61jSHaXCNEL._AC_UF1000,1000_QL80_DpWeblab_.jpg",
      price: 600
    },
    {
      _id: "683089ec8930404b988da3d3",
      name: "Power Bank",
      description: "20000mAh power bank",
      image: "https://mobilla.in/cdn/shop/files/723grey.webp?v=1727680683",
      price: 50
    },
    {
      _id: "683089ec8930404b988da3d4",
      name: "Drone",
      description: "4K drone for aerial shots",
      image: "https://cdn.thewirecutter.com/wp-content/media/2023/08/drones-2048px-0718.jpg",
      price: 1000
    },
    {
      _id: "683089ec8930404b988da3d5",
      name: "Guitar",
      description: "Acoustic guitar",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
      price: 250
    },
    {
      _id: "683089ec8930404b988da3d6",
      name: "Mic",
      description: "Studio microphone",
      image: "https://www.fingers.co.in/secure/api/uploads/categories/1710582871_Main-Mobile.jpg",
      price: 100
    }
  ];

  const handleRent = (product) => {
    addToCart(product);
    navigate('/cart');
  };

 return (
  <div className="home-container">
  <nav className="navbar">
  <h2 className="logo">RentKaro</h2>
  <div className="nav-links">
    <Link to="/" className="nav-link">Home</Link>
    <Link to="/cart" className="nav-link">Cart</Link>
    <Link to="/track" className="nav-link">Track</Link>
  </div>
</nav>


    <h1 className="home-title">Available Products for Rent</h1>
    <div className="product-grid">
      {products.map(product => (
        <div className="product-card" key={product._id}>
          <img src={product.image} alt={product.name} className="product-image" />
          <h2 className="product-name">{product.name}</h2>
          <p className="product-description">{product.description}</p>
          <p className="product-price">₹{product.price} / day</p>
          <button className="rent-button" onClick={() => handleRent(product)}>
            Rent
          </button>
        </div>
      ))}
    </div>
  </div>
);
}

export default HomePage;
