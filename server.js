const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/products', require('./routes/products'));
app.use('/api/notifications', require('./routes/notifications'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Management Dashboard System API',
    version: '1.0.0',
    endpoints: [
      '/api/auth - Authentication',
      '/api/reports - Daily reports',
      '/api/maintenance - Maintenance planning',
      '/api/inventory - Inventory management',
      '/api/products - Product & QC management',
      '/api/notifications - Notification system'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});