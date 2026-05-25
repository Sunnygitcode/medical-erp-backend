const mongoose = require('mongoose');
const MedicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  rackNumber: {
    type: String,
    trim: true,
    default: 'N/A'
  }
}, { 
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});
MedicineSchema.virtual('pricePerUnit').get(function() {
  return this.price;
});
MedicineSchema.virtual('stockQuantity').get(function() {
  return this.stock;
});
module.exports = mongoose.model('Medicine', MedicineSchema);
