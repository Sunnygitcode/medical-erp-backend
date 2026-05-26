const express = require('express');
const cors = require('cors');
const connectDatabase = require('./config/db');
require('dotenv').config();
const erpRoutes = require('./routes/erpRoutes');

const app = express();

app.use(cors({ 
  origin: 'https://vercel.app',
  credentials: true 
})); 

app.use(express.json());

connectDatabase();

app.use('/api', erpRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 MEDICAL ENGINE RUNNING ON PORT ${PORT}`));
