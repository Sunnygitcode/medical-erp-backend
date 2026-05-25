const crypto = require('crypto');
const Medicine = require('../models/Medicine.js');
const Invoice = require('../models/Invoice');
function generateAlphanumericInvoice() {
  const year = new Date().getFullYear();
  const tokens = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `MED-${year}-${tokens}`;
}
exports.getAllMedicinesList = async (req, res) => {
  try {
    const list = await Medicine.find({});
    console.log("Database se aayi hui medicines:", list);
    res.json(list);
  } catch (err) {
    console.error("Backend fetch error:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.getAllInvoices = async (req, res) => {

  try {

    const invoices = await Invoice.find()
      .sort({ createdAt: -1 });

    res.json(invoices);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });

  }

};
exports.processCheckout = async (req, res) => {
  const { patientName, patientAge, patientPhone, items, paymentMethod, staffName } = req.body;
  try {
    let grandTotal = 0;
    const processedItems = [];
    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId);
      if (!medicine || medicine.stockQuantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient inventory pool assets for ${item.name}` });
      }
      await Medicine.findByIdAndUpdate(item.medicineId, { $inc: { stockQuantity: -item.quantity } });
      const totalCost = medicine.pricePerUnit * item.quantity;
      grandTotal += totalCost;
      processedItems.push({
        medicineId: medicine._id, name: medicine.name, category: medicine.category,
        quantity: item.quantity, pricePerUnit: medicine.pricePerUnit, totalCost
      });
    }
    const newInvoice = new Invoice({
      invoiceNumber: generateAlphanumericInvoice(),
      patientName, patientAge, patientPhone, soldItems: processedItems, grandTotal, paymentMethod,
      performedBy: staffName || 'Cashier',
      paymentStatus: paymentMethod === 'Cash' ? 'Completed' : 'Pending'
    });
    await newInvoice.save();
    res.status(201).json(newInvoice);
  } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.verifyPayment = async (req, res) => {
  try {
    const { invoiceId } = req.body;
    await Invoice.findByIdAndUpdate(invoiceId, { paymentStatus: 'Completed' });
    res.json({ success: true, message: "Payment verified successfully!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
