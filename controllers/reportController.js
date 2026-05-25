const Invoice = require('../models/Invoice');

exports.getAuditLogs = async (req, res) => {
  try {
    const { name, date, invoiceId } = req.query;
    let condition = {};
    if (invoiceId) condition.invoiceNumber = invoiceId.trim().toUpperCase();
    if (name) condition.patientName = { $regex: name, $options: 'i' };
    if (date) {
      const start = new Date(date); start.setHours(0,0,0,0);
      const end = new Date(date); end.setHours(23,59,59,999);
      condition.saleDate = { $gte: start, $lte: end };
    }
    const data = await Invoice.find(condition).sort({ saleDate: -1 });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getOwnerMetrics = async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    const daily = await Invoice.aggregate([
      { $match: { saleDate: { $gte: today }, paymentStatus: 'Completed' } },
      { $group: { _id: null, total: { $sum: "$grandTotal" } } }
    ]);
    const monthly = await Invoice.aggregate([
      { $match: { saleDate: { $gte: firstDay }, paymentStatus: 'Completed' } },
      { $group: { _id: null, total: { $sum: "$grandTotal" } } }
    ]);

    // Anti-Fraud Audit System Data Pull Execution
    const securityTrails = await Invoice.find({}).sort({ createdAt: -1 }).limit(10).select('invoiceNumber performedBy paymentMethod grandTotal createdAt');
    
    const mappedLogs = securityTrails.map(t => ({
      timestamp: t.createdAt,
      performedBy: t.performedBy,
      details: `Generated Invoice reference ${t.invoiceNumber} worth ₹${t.grandTotal} via payment mode ${t.paymentMethod}`
    }));

    res.json({ 
      todayEarning: daily[0]?.total || 0, 
      monthEarning: monthly[0]?.total || 0,
      securityLogs: mappedLogs
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
};