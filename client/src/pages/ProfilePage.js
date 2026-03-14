import React, { useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

function ProfilePage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get userId from JWT token
    const token = localStorage.getItem('token');
    let userId = null;
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        userId = decodedPayload.userId;
      } catch (e) {}
    }
    if (!userId) {
      setError('User not logged in.');
      setLoading(false);
      return;
    }
    fetch(`http://localhost:5000/api/users/${userId}/rentals`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setError(data.error || 'Failed to load orders');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load orders');
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="rk-profile-page" style={{ minHeight: '80vh', padding: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '32px' }}>My Orders</h1>
        {loading && <p>Loading orders...</p>}
        {error && !loading && <div style={{ color: '#dc2626', marginBottom: '24px' }}>{error}</div>}
        {!loading && !error && orders.length === 0 && <p>No orders found.</p>}
        {!loading && !error && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map(order => (
              <div key={order.rentalId} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '24px', background: '#fafafa', display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontWeight: '600', color: order.status === 'cancelled' ? '#ef4444' : '#10b981' }}>{order.status}</span>
                  </div>
                  <div style={{ marginBottom: '8px' }}>Placed: {new Date(order.createdAt).toLocaleString()}</div>
                  <div style={{ marginBottom: '8px' }}>Total: ₹{order.total}</div>
                  <div style={{ marginBottom: '8px' }}>Items: {order.items.map(i => i.name).join(', ')}</div>
                  <button className="rk-btn rk-btn-primary" onClick={() => window.location.href = `/track-order?trackingId=${order.rentalId}`}>Track Order</button>
                </div>
                <div style={{ minWidth: '120px', textAlign: 'center' }}>
                  <img src={order.items[0]?.image} alt={order.items[0]?.name} style={{ width: '100px', height: '100px', objectFit: 'contain', borderRadius: '8px', marginBottom: '8px', background: '#fff', border: '1px solid #eee' }} />
                  <div style={{ fontWeight: '600', color: order.status === 'cancelled' ? '#ef4444' : '#10b981', fontSize: '1rem' }}>{order.status}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default ProfilePage;
