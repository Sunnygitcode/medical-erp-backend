const mongoose = require('mongoose');

const SoldItemSchema = new mongoose.Schema({
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  pricePerUnit: {
    type: Number,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  }
}, { _id: false }); 
const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  patientAge: {
    type: Number,
    required: true
  },
  patientPhone: {
    type: String,
    required: true,
    trim: true
  },
  soldItems: [SoldItemSchema],
  grandTotal: {
    type: Number,
    required: true,
    default: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Cash', 'Card', 'UPI', 'Pending']
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  performedBy: {
    type: String,
    required: true,
    default: 'Cashier'
  },
  saleDate: {
    type: Date,
    default: Date.now,
    index: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
