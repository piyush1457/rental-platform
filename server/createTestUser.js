const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./User'); 
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rentalPlatform', {
 
});


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
    mongoose.disconnect();
  }
}

createTestUser();
