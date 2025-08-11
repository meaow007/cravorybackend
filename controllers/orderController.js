const Order = require('../models/Order');

const placeOrder = async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error('Order placement error:', err);
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
};

module.exports = { placeOrder };
