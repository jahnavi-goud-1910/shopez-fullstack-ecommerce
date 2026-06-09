const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const keyword  = req.query.search   ? { name: { $regex: req.query.search, $options: 'i' } } : {};
    const category = req.query.category && req.query.category !== 'All' ? { category: req.query.category } : {};
    const products = await Product.find({ ...keyword, ...category });
    res.json(products);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: 'Product not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) { res.status(400).json({ message: error.message }); }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      Object.assign(product, req.body);
      const updated = await product.save();
      res.json(updated);
    } else res.status(404).json({ message: 'Product not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) { await product.deleteOne(); res.json({ message: 'Product removed' }); }
    else res.status(404).json({ message: 'Product not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const already = product.reviews.find(r => r.user.toString() === req.user._id.toString());
    if (already) return res.status(400).json({ message: 'Already reviewed' });
    product.reviews.push({ user: req.user._id, name: req.user.name, rating: Number(rating), comment });
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createReview };
