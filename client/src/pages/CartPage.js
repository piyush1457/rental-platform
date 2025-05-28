import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import './CartPage.css';
import { useNavigate, Link } from 'react-router-dom';

const CancelledOrderDetails = ({ cancellationId, cancelledOrder }) => {
  if (!cancelledOrder) return <p>Loading cancelled order details...</p>;

  return (
    <div className="cancellation-details">
      <h2>Order Cancelled Successfully!</h2>
      <p className="empty-cart">
        Your Cancellation ID:{' '}
        <span className="font-mono bg-gray-100 px-2 py-1 rounded">{cancellationId}</span>
      </p>
      <h3>Cancelled Order Details:</h3>
      {cancelledOrder.items.map((item, index) => (
        <div key={index} className="cart-item">
          <img src={item.image} alt={item.name} className="cart-image" />
          <div className="cart-details">
            <h2 className="item-name">{item.name}</h2>
            <p className="item-price">₹{item.price} / day</p>
            <p className="item-label">Duration: {item.duration} days</p>
            <p className="subtotal">Subtotal: ₹{item.price * item.duration}</p>
          </div>
        </div>
      ))}
      <h2 className="total">Total: ₹{cancelledOrder.total}</h2>
    </div>
  );
};

const Cart = () => {
  const { cartItems, updateDuration, clearCart, cartMessage } = useCart();
  const [ordered, setOrdered] = useState(false);
  const [trackingId, setTrackingId] = useState(null);
  const [cancellationId, setCancellationId] = useState(null);
  const [cancelledOrder, setCancelledOrder] = useState(null);
  const [copyMessage, setCopyMessage] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.duration, 0);

  const placeOrder = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartItems, total }),
      });

      const data = await res.json();

      if (res.ok) {
        setTrackingId(data.rentalId);
        setOrderDetails({ items: cartItems, total });
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
    if (!trackingId) {
      console.error('No tracking ID available to cancel order');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/rentals/${trackingId}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        if (!data.cancellationId || !data.cancelledOrder) {
          console.error('Cancel response missing expected data:', data);
          return;
        }
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

  // DEBUG LOGS (remove in production)
  // console.log({ ordered, trackingId, cancellationId, cancelledOrder, orderDetails });

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

      {ordered ? (
        <>
          {/* Show placed order only if trackingId & orderDetails exist and no cancellation */}
          {trackingId && orderDetails && !cancellationId && (
            <>
              <h1 className="order-success">Order Placed Successfully!</h1>
              <p className="empty-cart">
                Your Tracking ID:{' '}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{trackingId}</span>{' '}
                <button onClick={copyTrackingId} className="copy-button">Copy</button>
              </p>
              {copyMessage && <p style={{ color: 'green' }}>{copyMessage}</p>}

              <div className="order-details">
                <h2>Order Details:</h2>
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-image" />
                    <div className="cart-details">
                      <h2 className="item-name">{item.name}</h2>
                      <p className="item-price">₹{item.price} / day</p>
                      <p className="item-label">Duration: {item.duration} days</p>
                      <p className="subtotal">Subtotal: ₹{item.price * item.duration}</p>
                    </div>
                  </div>
                ))}
                <h2 className="total">Total: ₹{orderDetails.total}</h2>
              </div>

              <div className="cart-buttons">
                <button onClick={cancelOrder} className="clear-cart-button">
                  Cancel Order
                </button>
                <button onClick={handleGoHome} className="place-order-button">
                  Go to Home
                </button>
                <button onClick={handleTrack} className="place-order-button">
                  Track Order
                </button>
              </div>
            </>
          )}

          {/* Show cancelled order if cancellationId and cancelledOrder exist */}
          {cancellationId && cancelledOrder && (
            <>
              <CancelledOrderDetails cancellationId={cancellationId} cancelledOrder={cancelledOrder} />
              <div className="cart-buttons" style={{ marginTop: '1rem' }}>
                <button onClick={handleGoHome} className="place-order-button">
                  Go to Home
                </button>
                <button onClick={handleTrack} className="place-order-button">
                  Track Order
                </button>
              </div>
            </>
          )}

          {/* Fallback message if no order or cancellation info */}
          {!trackingId && !cancellationId && (
            <p>No order or cancellation details available.</p>
          )}
        </>
      ) : (
        <>
          <h1 className="cart-title">Your Cart</h1>

          {cartMessage && (
            <div className="cart-message">{cartMessage}</div>
          )}

          {cartItems.length === 0 ? (
            <p className="empty-cart">No items in cart.</p>
          ) : (
            <>
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-image" />
                  <div className="cart-details">
                    <h2 className="item-name">{item.name}</h2>
                    <p className="item-price">₹{item.price} / day</p>
                    <label className="item-label">Duration (days):</label>
                    <input
                      type="number"
                      min="1"
                      value={item.duration}
                      onChange={(e) => updateDuration(index, parseInt(e.target.value))}
                      className="duration-input"
                    />
                    <p className="subtotal">Subtotal: ₹{item.price * item.duration}</p>
                  </div>
                </div>
              ))}
              <h2 className="total">Total: ₹{total}</h2>
              <div className="cart-buttons">
                <button onClick={clearCart} className="clear-cart-button">
                  Clear Cart
                </button>
                <button onClick={placeOrder} className="place-order-button">
                  Place Order
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
