const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const healthRecordRoutes = require('./routes/healthRecords');

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3003'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/health-record-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected successfully');
    console.log('Connection URI:', process.env.MONGO_URI);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.error('Connection URI:', process.env.MONGO_URI);
    process.exit(1); // Exit if cannot connect to database
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/health-records', healthRecordRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
