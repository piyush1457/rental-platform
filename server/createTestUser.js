const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./User'); // Make sure this path is correct
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rentalPlatform', {
  // No need for deprecated options anymore with Mongoose 7+
});

// Create test user
async function createTestUser() {
  try {
    const existing = await User.findOne({ email: 'test@example.com' });
    if (existing) {
      console.log('Test user already exists');
      mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash('123456', 10);

    const user = new User({
      email: 'test@example.com',
      password: hashedPassword,
    });

    await user.save();
    console.log('Test user created');
  } catch (err) {
    console.error('Error creating test user:', err);
  } finally {
    mongoose.disconnect(); // Clean disconnect
  }
}

createTestUser();
