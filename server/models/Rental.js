const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  rentalId: { type: String, required: true, unique: true },
  cancellationId: { type: String, default: null },
  items: [
    {
      name: String,
      image: String,
      price: Number,
      duration: Number,
    },
  ],
  total: { type: Number, required: true },
  status: { type: String, enum: ['active', 'cancelled'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Rental', rentalSchema);
