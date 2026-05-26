const Invoice = require('../models/Invoice');

exports.searchInvoices = async (req, res) => {
  try {
    const { invoiceId, name, date } = req.query;
    let queryConditions = {};

    if (invoiceId && invoiceId.trim() !== "") {
      queryConditions.invoiceNumber = { $regex: invoiceId.trim(), $options: 'i' };
    }

    if (name && name.trim() !== "") {
      queryConditions.patientName = { $regex: name.trim(), $options: 'i' };
    }

    if (date && date.trim() !== "") {
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);

      queryConditions.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const results = await Invoice.find(queryConditions)
      .populate('soldItems.medicineId')
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    console.error("Search query execution failed:", err);
    res.status(500).json({ error: err.message });
  }
};
