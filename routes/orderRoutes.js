const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // ✅ FIXED path

// POST /api/orders
router.post('/', async (req, res) => {
  try {
    const { name, address, phone, paymentMethod, cartItems, totalAmount } = req.body;

    if (!name || !address || !phone || !paymentMethod || !cartItems || !totalAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const order = new Order({
      name,
      address,
      phone,
      paymentMethod,
      cartItems,
      totalAmount
    });

    await order.save();
    res.status(201).json({ message: 'Order saved successfully' });

  } catch (err) {
    console.error('❌ Error saving order:', err);
    res.status(500).json({ error: 'Failed to save order' });
  }
});

// GET /api/orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});
// PATCH /api/orders/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});
router.post('/', async (req, res) => {
  try {
    console.log('📥 Received body:', req.body); // Confirm structure
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('❌ Error saving order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
