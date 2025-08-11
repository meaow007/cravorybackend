// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Order = require('./models/Order'); // make sure path is correct
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000; // or change if needed
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const path = require('path');
const admin = require("firebase-admin");
const serviceAccount = require("./config/cravory-c19af-firebase-adminsdk-fbsvc-6a3011921b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cravory-c19af.firebaseio.com" // Replace with your Firebase DB URL
});




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
mongoose.connect('mongodb://127.0.0.1:27017/cravory', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/products', require('./routes/productRoutes'));
app.get('/', (req, res) => {
  res.send('Cravory Backend Running');
});
app.post('/api/orders', async (req, res) => {
  try {
    console.log('📦 Incoming order:', req.body); // ✅ Add this
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error('❌ Error saving order:', err.message); // ✅ Show actual error
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
app.listen(5000,'0.0.0.0', () => {
  console.log("Server running on http://192.168.31.77:5000")
});
