import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import '../components/cart/CartComponents.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartItemsList from '../components/cart/CartItemsList';
import OrderSummaryCard from '../components/cart/OrderSummaryCard';
import { CheckCircle } from 'lucide-react';

const CancelledOrderDetails = ({ cancellationId, cancelledOrder }) => {
  if (!cancelledOrder) return <p>Loading cancelled order details...</p>;

  return (
    <div className="rk-empty-cart" style={{ textAlign: 'center', padding: '40px' }}>
      <h2 style={{ color: '#d32f2f' }}>Order Cancelled Successfully!</h2>
      <p style={{ margin: '20px 0' }}>
        Cancellation ID:{' '}
        <span className="font-mono bg-gray-100 px-2 py-1 rounded">{cancellationId}</span>
      </p>
      
      <div style={{ textAlign: 'left', background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
        <h3 style={{ marginBottom: '16px' }}>Cancelled Order Details:</h3>
        {cancelledOrder.items.map((item, index) => (
          <div key={index} style={{ display: 'flex', gap: '16px', marginBottom: '12px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
            <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'contain', background: '#f9f9f9', borderRadius: '4px' }} />
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{item.name}</h4>
              <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '0.9rem' }}>₹{item.price} / day × {item.duration} days</p>
              <p style={{ margin: 0, fontWeight: '600' }}>Subtotal: ₹{item.price * item.duration}</p>
            </div>
          </div>
        ))}
        <h3 style={{ marginTop: '16px', textAlign: 'right' }}>Total Refunded: ₹{cancelledOrder.total}</h3>
      </div>
    </div>
  );
};

const CartPage = () => {
  const { cartItems, clearCart } = useCart();
  const [ordered, setOrdered] = useState(false);
  const [trackingId, setTrackingId] = useState(null);
  const [cancellationId, setCancellationId] = useState(null);
  const [cancelledOrder, setCancelledOrder] = useState(null);
  const [copyMessage, setCopyMessage] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const total = cartItems.reduce((sum, item) => sum + item.price * item.duration, 0);

  const placeOrder = async () => {
    // Map the items precisely to what the backend Rental schema expects
    const mappedItems = cartItems.map(item => ({
      name: item.name || 'Unknown Item',
      price: item.price || 0,
      image: item.image || '',
      duration: item.duration || 1
    }));
    try {
      const res = await fetch('http://localhost:5000/api/rentals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: mappedItems, total }),
      });
      const data = await res.json();
      if (res.ok) {
        setTrackingId(data.rentalId);
        setOrderDetails({ items: mappedItems, total });
        clearCart();
        setOrdered(true);
        setCancellationId(null);
        setCancelledOrder(null);
      } else {
        console.error('Order error:', data.error);
      }
    } catch (err) {
      console.error('Order failed:', err);
    }
  };

  const cancelOrder = async () => {
    if (!trackingId) return;

    try {
      const res = await fetch(`http://localhost:5000/api/rentals/${trackingId}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        setCancellationId(data.cancellationId);
        setCancelledOrder(data.cancelledOrder);
        setOrderDetails(null);
        setTrackingId(null);
      } else {
        console.error('Cancel error:', data.error);
      }
    } catch (err) {
      console.error('Cancellation failed:', err);
    }
  };

  const handleGoHome = () => navigate('/');
  const handleTrack = () => navigate('/track');

  const copyTrackingId = () => {
    if (trackingId) {
      navigator.clipboard.writeText(trackingId)
        .then(() => {
          setCopyMessage('Copied!');
          setTimeout(() => setCopyMessage(''), 2000);
        })
        .catch(() => {
          setCopyMessage('Failed to copy');
          setTimeout(() => setCopyMessage(''), 2000);
        });
    }
  };

  return (
    <>
      <Navbar />
      <div className="rk-cart-page" style={{ minHeight: '80vh' }}>
        
        {ordered ? (
          <>
            {trackingId && orderDetails && !cancellationId && (
              <div className="rk-empty-cart">
                <CheckCircle size={64} style={{ color: '#10b981', marginBottom: '20px' }} />
                <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Order Placed Successfully!</h1>
                
                <div style={{ background: '#f0fdf4', padding: '16px 24px', borderRadius: '8px', border: '1px solid #bbf7d0', margin: '20px 0' }}>
                  <p style={{ margin: 0, fontSize: '1.1rem' }}>
                    Tracking ID:{' '}
                    <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{trackingId}</span>{' '}
                    <button onClick={copyTrackingId} style={{ marginLeft: '10px', padding: '4px 12px', borderRadius: '4px', border: '1px solid #10b981', background: 'transparent', cursor: 'pointer', color: '#10b981', fontWeight: 'bold' }}>Copy</button>
                  </p>
                  {copyMessage && <p style={{ color: '#10b981', margin: '8px 0 0 0', fontSize: '0.9rem' }}>{copyMessage}</p>}
                </div>

                <div style={{ display: 'flex', gap: '16px', marginTop: '30px' }}>
                  <button onClick={cancelOrder} className="rk-btn rk-btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }}>
                    Cancel Order
                  </button>
                  <button onClick={handleGoHome} className="rk-btn" style={{ background: '#f3f4f6', color: '#374151' }}>
                    Home
                  </button>
                  <button onClick={handleTrack} className="rk-btn rk-btn-primary">
                    Track Order
                  </button>
                </div>
              </div>
            )}

            {cancellationId && cancelledOrder && (
              <>
                <CancelledOrderDetails cancellationId={cancellationId} cancelledOrder={cancelledOrder} />
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px' }}>
                  <button onClick={handleGoHome} className="rk-btn rk-btn-outline">
                    Home
                  </button>
                </div>
              </>
            )}

            {!trackingId && !cancellationId && (
              <p style={{ textAlign: 'center' }}>No order or cancellation details available.</p>
            )}
          </>
        ) : (
          <>
            <h1 className="rk-cart-page-title">Your Cart</h1>
            <div className="rk-cart-layout">
              <CartItemsList />
              <OrderSummaryCard placeOrder={placeOrder} handleGoHome={handleGoHome} ordered={ordered} />
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
