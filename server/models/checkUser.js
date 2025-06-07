
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../User'); 

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rentalPlatform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkUsers() {
  const users = await User.find();
  console.log(users);
  mongoose.disconnect();
}

checkUsers();
