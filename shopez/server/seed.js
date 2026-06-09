// Run once to populate the database with sample products
// Command: node seed.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling headphones with 30-hour battery life.',
    price: 4999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    countInStock: 25,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Running Shoes Pro',
    description: 'Lightweight breathable shoes with advanced cushioning technology.',
    price: 3499,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    countInStock: 40,
    rating: 4.2,
    numReviews: 8,
  },
  {
    name: 'Mechanical Keyboard RGB',
    description: 'RGB backlit mechanical keyboard with tactile switches for gaming.',
    price: 6999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
    countInStock: 15,
    rating: 4.7,
    numReviews: 20,
  },
  {
    name: 'Cotton Casual T-Shirt',
    description: '100% pure cotton comfortable t-shirt in multiple colors.',
    price: 499,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    countInStock: 100,
    rating: 4.0,
    numReviews: 35,
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Keeps drinks cold 24hrs, hot 12hrs. 750ml capacity.',
    price: 899,
    category: 'Kitchen',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    countInStock: 60,
    rating: 4.3,
    numReviews: 15,
  },
  {
    name: 'Smart Watch Series X',
    description: 'Heart rate monitor, GPS, and 5-day battery.',
    price: 12999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    countInStock: 10,
    rating: 4.6,
    numReviews: 22,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    await Product.deleteMany();
    await Product.insertMany(sampleProducts);
    console.log(`✅ ${sampleProducts.length} products inserted!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
