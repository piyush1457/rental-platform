import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './CartPage.css';

const TrackOrderPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTrackingId = searchParams.get('trackingId') || '';
  const [trackingId, setTrackingId] = useState(initialTrackingId);
  const [rental, setRental] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (trackingId) {
      fetchRental(trackingId);
    }
  }, [trackingId]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const fetchRental = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/rentals/${id}`);
      const data = await res.json();

      if (res.ok) {
        setRental(data);
        setError('');
      } else {
        setRental(null);
        setError(data.error || 'Rental not found');
      }
    } catch (err) {
      setRental(null);
      setError('Something went wrong while fetching order.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID.');
      setRental(null);
      return;
    }

    setSearchParams({ trackingId });
    fetchRental(trackingId);
  };

  return (
    <div className="cart-container">
      <nav className="navbar">
        <h2 className="logo">RentKaro</h2>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/cart" className="nav-link">Cart</Link>
          <Link to="/track" className="nav-link">Track</Link>
        </div>
      </nav>

      <h1 className="cart-title">Track Your Order</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          ref={inputRef}
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter Tracking ID"
          className="duration-input"
          style={{ flex: '1' }}
        />
        <button
          onClick={handleTrack}
          className="place-order-button"
          style={{ padding: '10px 16px', minWidth: '100px' }}
        >
          Track
        </button>
      </div>

      {loading && <p className="empty-cart">Loading...</p>}
      {error && !loading && (
        <p className="empty-cart" style={{ color: '#d32f2f' }}>{error}</p>
      )}

      {rental && !loading && (
        <div>
          <p className="item-label" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            Showing details for order:
          </p>
          <p className="item-label" style={{ marginBottom: '15px' }}>
            Tracking ID: <span style={{ fontFamily: 'monospace', backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>{rental._id}</span>
          </p>

          <h2 className="cart-title" style={{ fontSize: '1.5rem', marginBottom: '15px' }}>
            Rental Details
          </h2>
          <p><strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{rental.status}</span></p>
          <p><strong>Total Price:</strong> ₹{rental.total}</p>
          <p><strong>Created At:</strong> {new Date(rental.createdAt).toLocaleString()}</p>

          {rental.status === 'cancelled' && (
            <p style={{ color: '#d32f2f', marginTop: '10px' }}>
              <strong>Note:</strong> This order was cancelled.
            </p>
          )}

          <h3 className="item-label" style={{ marginTop: '20px' }}>Items:</h3>
          {rental.items.map((item, i) => (
            <div key={i} className="cart-item" style={{ marginBottom: '10px' }}>
              <img
                src={item.image}
                alt={item.name}
                className="cart-image"
                style={{ width: '80px', height: '80px', flexShrink: 0 }}
              />
              <div className="cart-details" style={{ flex: 1 }}>
                <h4 className="item-name">{item.name}</h4>
                <p className="item-price">
                  ₹{item.price} / day × {item.duration} days = ₹{item.price * item.duration}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
