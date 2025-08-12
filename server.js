// server.js
require('dotenv').config();  // Load .env variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Order = require('./models/Order'); // make sure path is correct
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000; // use port from env or default 5000
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const path = require('path');

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",      // web dev
    "capacitor://localhost",      // Android/iOS app
    "http://localhost",           // emulator case
    "http://192.168.31.77:5000"   // direct IP access from phone
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'))

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000 // ⬅ 5 seconds timeout
})
.then(() => console.log('MongoDB connected'))
.catch(err => {console.error('MongoDB connection error:', err);
  process.exit(1);
});
// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('Cravory Backend Running');
});

app.post('/api/orders', async (req, res) => {
  try {
    console.log('📦 Incoming order:', req.body);
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error('❌ Error saving order:', err.message);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
