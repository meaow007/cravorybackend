const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  paymentMethod: String,
  cartItems: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    }
  ],
  totalAmount: Number,
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'In Kitchen', 'On the Way', 'Delivered']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
