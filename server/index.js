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


mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rentalPlatform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

const rentalSchema = new mongoose.Schema({
  rentalId: { type: String, unique: true, required: true },
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
  cancellationId: { type: String, default: null },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: { type: String, default: null },
});
const Rental = mongoose.model('Rental', rentalSchema);

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

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


    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Password incorrect');
      return res.status(401).json({ error: 'Invalid email or password' });
    }


    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login error: ' + err.message });
  }
});


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


// ADD PRODUCT MODEL
const Product = require('./models/Product');

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products: ' + err.message });
  }
});

const axios = require('axios');

app.get('/api/amazon/search', async (req, res) => {
  const query = req.query.q || 'electronics';

  const options = {
    method: 'GET',
    url: 'https://real-time-amazon-data.p.rapidapi.com/search',
    params: {
      query: query,
      page: '1',
      country: 'US',
      sort_by: 'RELEVANCE',
      product_condition: 'ALL'
    },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': process.env.RAPIDAPI_HOST
    }
  };

  try {
    const response = await axios.request(options);

    // Transform Amazon's data structure into our RentKaro structure
    const mappedProducts = (response.data.data.products || []).slice(0, 20).map((p, idx) => ({
      _id: `amazon-${Date.now()}-${idx}`,
      name: p.product_title,
      description: 'Available for daily rental.',
      image: p.product_photo,
      price: Math.max(10, Math.floor((p.product_price ? parseFloat(p.product_price.replace('$', '')) : 100) / 10)) // Make rental price ~10% of retail
    }));

    res.json(mappedProducts);
  } catch (error) {
    console.error('Amazon API Error:', error);
    res.status(500).json({ error: 'Failed to fetch from Amazon' });
  }
});


app.post('/api/rentals', authenticateToken, async (req, res) => {
  const { items, total } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty cart items.' });
  }
  const rentalId = uuidv4().toUpperCase();
  try {
    const rental = new Rental({ rentalId, items, total, userId: req.user.userId });
    await rental.save();
    res.status(201).json({ message: 'Rental placed', rentalId });
  } catch (err) {
    res.status(500).json({ error: 'Error placing rental: ' + err.message });
  }
});


app.get('/api/rentals/:rentalId', async (req, res) => {
  try {
    let rental = await Rental.findOne({ rentalId: req.params.rentalId });

    if (!rental) {
      rental = await Rental.findOne({ cancellationId: req.params.rentalId });
    }

    if (!rental) return res.status(404).json({ error: 'Rental not found' });

    res.json(rental);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching rental: ' + err.message });
  }
});


app.get('/api/users/:userId/rentals', authenticateToken, async (req, res) => {
  if (req.user.userId !== req.params.userId) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  try {
    const rentals = await Rental.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(rentals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user orders: ' + err.message });
  }
});


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

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
