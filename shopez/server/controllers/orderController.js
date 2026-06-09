const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice } = req.body;
    if (!orderItems || orderItems.length === 0) return res.status(400).json({ message: 'No order items' });
    const order = await Order.create({ user: req.user._id, orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, totalPrice });
    res.status(201).json(order);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) res.json(order);
    else res.status(404).json({ message: 'Order not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isPaid = true; order.paidAt = Date.now(); order.status = 'Processing';
      order.paymentResult = { id: req.body.id, status: req.body.status, updateTime: req.body.update_time };
      res.json(await order.save());
    } else res.status(404).json({ message: 'Order not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status;
      if (req.body.status === 'Delivered') { order.isDelivered = true; order.deliveredAt = Date.now(); }
      res.json(await order.save());
    } else res.status(404).json({ message: 'Order not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderToPaid, getAllOrders, updateOrderStatus };
