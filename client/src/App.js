import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Cart from './pages/CartPage';
import RequestPage from './pages/RequestPage';
import TrackOrderPage from './pages/TrackOrderPage';




import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />  {/* Redirect root to login */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/request" element={<RequestPage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          {/* Add other routes here */}
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
