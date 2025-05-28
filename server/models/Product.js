const mongoose = require('mongoose');
module.exports = mongoose.model('Product', new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  price: Number
}));
