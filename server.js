const express = require('express');
const cors = require('cors');
const connectDatabase = require('./config/db');
require('dotenv').config();
const erpRoutes = require('./routes/erpRoutes');

const app = express();

// ✅ 100% PERFECT MULTI-ORIGIN PRODUCTION GATEWAY FIXED HERE
const allowedOrigins = [
  'https://sannirajput-medical-erp.vercel.app',
  'https://medical-erp-frontend-cjyl.vercel.app',
  'https://vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Local request ya empty origin server bypass allow karne ke liye
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS secure policy framework'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

connectDatabase();

app.use('/api', erpRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 MEDICAL ENGINE RUNNING ON PORT ${PORT}`));
