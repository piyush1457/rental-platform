import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../components/cart/CartComponents.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

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
    <>
      <Navbar />
      <div className="rk-cart-page" style={{ minHeight: '80vh' }}>
        <h1 className="rk-cart-page-title">Track Your Order</h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', maxWidth: '600px' }}>
        <input
          ref={inputRef}
          type="text"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter Tracking ID (e.g. 58632CCA...)"
          style={{ flex: '1', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
        />
        <button
          onClick={handleTrack}
          className="rk-btn rk-btn-primary"
          style={{ padding: '0 24px' }}
        >
          Track
        </button>
      </div>

      {loading && <p>Loading order details...</p>}
      {error && !loading && (
        <div style={{ padding: '16px', backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: '8px', border: '1px solid #fca5a5' }}>
          {error}
        </div>
      )}

      {rental && !loading && (
        <div className="rk-order-summary-card" style={{ maxWidth: '800px', position: 'static' }}>
          <p style={{ fontWeight: '600', color: '#666', marginBottom: '8px', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.5px' }}>
            Showing details for order:
          </p>
          <div style={{ background: '#f5f5f5', padding: '12px 16px', borderRadius: '6px', marginBottom: '24px', wordBreak: 'break-all' }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '1.1rem' }}>{rental._id}</span>
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
            Rental Details
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Status</span>
              <span style={{ fontWeight: '600', textTransform: 'capitalize', color: rental.status === 'cancelled' ? '#ef4444' : '#10b981' }}>{rental.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>Date Placed</span>
              <span style={{ fontWeight: '500' }}>{new Date(rental.createdAt).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
              <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>Total Price</span>
              <span style={{ fontWeight: '700', fontSize: '1.25rem', color: '#ff6b00' }}>₹{rental.total}</span>
            </div>
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '16px' }}>Ordered Items</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {rental.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '20px', padding: '16px', border: '1px solid #eee', borderRadius: '8px', background: '#fafafa' }}>
                <div style={{ width: '80px', height: '80px', background: '#fff', borderRadius: '6px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f0f0f0' }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: '600' }}>{item.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                      ₹{item.price} / day × {item.duration} days
                    </p>
                    <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>₹{item.price * item.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
      <Footer />
    </>
  );
};

export default TrackOrderPage;
