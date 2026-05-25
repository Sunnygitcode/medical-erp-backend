const Invoice = require('../models/Invoice');

exports.searchInvoices = async (req, res) => {
  try {
    const { invoiceId, name, date } = req.query;
    let queryConditions = {};

    // 1. FIX: invoiceNo ko badal kar invoiceNumber kiya (jo checkout controllers me save ho raha hai)
    if (invoiceId && invoiceId.trim() !== "") {
      queryConditions.invoiceNumber = { $regex: invoiceId.trim(), $options: 'i' };
    }

    // 2. Patient Name Search
    if (name && name.trim() !== "") {
      queryConditions.patientName = { $regex: name.trim(), $options: 'i' };
    }

    // 3. FIX: Date range matching standard format me
    if (date && date.trim() !== "") {
      const searchDate = new Date(date);
      
      // Pure din ka start (00:00:00.000)
      const startOfDay = new Date(searchDate.getBoundingBox ? searchDate : date);
      startOfDay.setHours(0, 0, 0, 0);

      // Pure din ka end (23:59:59.999)
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Aapke model me agar field 'createdAt' hai toh use yahan badlein
      queryConditions.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    // Records fetch karein aur latest orders ko sabse upar dikhane ke liye sort karein
    const results = await Invoice.find(queryConditions)
      .populate('soldItems.medicineId')
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    console.error("Search query execution failed:", err);
    res.status(500).json({ error: err.message });
  }
};