// Load environment variables FIRST
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');

// const PORT = 5000;
// const MONGODB_URI = 'mongodb+srv://mnaveenkumar4488:naveen1234@cluster0.axkyiei.mongodb.net/users'

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Print URI to check
console.log('MongoDB URI:', process.env.MONGODB_URI);


// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));


// ✅ Mount the routes correctly
app.use('/api/users', userRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Default route
app.get('/', (req, res) => {
    res.send('From the server');
  })