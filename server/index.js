const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rentalPlatform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema & Model
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // hashed password
});
const User = mongoose.model('User', userSchema);

// Rental Schema & Model
const rentalSchema = new mongoose.Schema({
  rentalId: { type: String, unique: true, required: true }, // UUID for tracking
  items: [
    {
      name: String,
      price: Number,
      image: String,
      duration: Number,
    },
  ],
  total: Number,
  status: {
    type: String,
    enum: ['placed', 'cancelled'],
    default: 'placed',
  },
  cancellationId: { type: String, default: null }, // New UUID if cancelled
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Rental = mongoose.model('Rental', rentalSchema);

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// ---------- AUTH ROUTES ----------

// POST /api/auth/login - Login user
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('User found:', user.email);
    console.log('Password from request:', typeof password, password);
    console.log('Password from DB:', typeof user.password, user.password);

    // Now compare
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Password incorrect');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login error: ' + err.message });
  }
});


// Optional: POST /api/auth/register to create new users (for testing, not mandatory)
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Registration error: ' + err.message });
  }
});

// ---------- RENTAL ROUTES ----------

// POST /api/rentals - Place Order
app.post('/api/rentals', async (req, res) => {
  const { items, total } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty cart items.' });
  }

  const rentalId = uuidv4().toUpperCase();

  try {
    const rental = new Rental({ rentalId, items, total });
    await rental.save();
    res.status(201).json({ message: 'Rental placed', rentalId });
  } catch (err) {
    res.status(500).json({ error: 'Error placing rental: ' + err.message });
  }
});

// GET /api/rentals/:rentalId - Fetch order
app.get('/api/rentals/:rentalId', async (req, res) => {
  try {
    let rental = await Rental.findOne({ rentalId: req.params.rentalId });

    // If not found by rentalId, try cancellationId
    if (!rental) {
      rental = await Rental.findOne({ cancellationId: req.params.rentalId });
    }

    if (!rental) return res.status(404).json({ error: 'Rental not found' });

    res.json(rental);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching rental: ' + err.message });
  }
});

// PATCH /api/rentals/:rentalId/cancel - Cancel Order
app.patch('/api/rentals/:rentalId/cancel', async (req, res) => {
  try {
    const rental = await Rental.findOne({ rentalId: req.params.rentalId });

    if (!rental) return res.status(404).json({ error: 'Rental not found' });
    if (rental.status === 'cancelled') {
      return res.status(400).json({ error: 'Order is already cancelled' });
    }

    rental.status = 'cancelled';
    rental.cancellationId = 'CANCEL-' + uuidv4().toUpperCase();

    await rental.save();

    res.json({
      message: 'Order cancelled successfully',
      cancellationId: rental.cancellationId,
      cancelledOrder: {
        items: rental.items,
        total: rental.total,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Error cancelling order: ' + err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
