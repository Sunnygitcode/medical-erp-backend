const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const billingController = require('../controllers/billingController');
const reportController = require('../controllers/reportController');
const inventoryController = require("../controllers/inventoryController");
router.post('/auth/register', authController.registerUser);
router.post('/auth/login', authController.loginUser);
router.get('/medicines/all-list', billingController.getAllMedicinesList);
router.post('/checkout', billingController.processCheckout);
router.post('/checkout-bill', billingController.processCheckout); 
router.post('/verify-payment', billingController.verifyPayment);
router.get('/reports/audit-logs', reportController.getAuditLogs);
router.get('/reports/owner-metrics', reportController.getOwnerMetrics);
router.get('/inventory/search', inventoryController.searchInvoices); 
router.get('/invoices/search', inventoryController.searchInvoices); 


router.get(
  '/bills/all',
  billingController.getAllInvoices
);

module.exports = router;
