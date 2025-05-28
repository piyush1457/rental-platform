const mongoose = require('mongoose');
module.exports = mongoose.model('Request', new mongoose.Schema({
  itemName: String,
  imageUrl: String,
  suggestedPrice: Number,
  description: String,
  duration: String
}));
