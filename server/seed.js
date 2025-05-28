const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://localhost:27017/rentalPlatform');

const products = Array.from({ length: 15 }).map((_, i) => ({
  name: `Product ${i + 1}`,
  description: 'A great item to rent.',
  image: 'https://via.placeholder.com/150',
  price: 10 + i
}));

Product.insertMany(products).then(() => {
  console.log('Seeded');
  process.exit();
});
