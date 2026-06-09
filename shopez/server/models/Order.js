const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  qty:     { type: Number, required: true },
  image:   { type: String, required: true },
  price:   { type: Number, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [orderItemSchema],
  shippingAddress: {
    address: { type: String, required: true },
    city:    { type: String, required: true },
    pincode: { type: String, required: true },
    phone:   { type: String, required: true },
  },
  paymentMethod:  { type: String, default: 'Razorpay' },
  paymentResult:  { id: String, status: String, updateTime: String },
  itemsPrice:     { type: Number, default: 0 },
  shippingPrice:  { type: Number, default: 0 },
  totalPrice:     { type: Number, default: 0 },
  isPaid:         { type: Boolean, default: false },
  paidAt:         { type: Date },
  isDelivered:    { type: Boolean, default: false },
  deliveredAt:    { type: Date },
  status: {
    type: String,
    enum: ['Pending','Processing','Shipped','Delivered','Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
