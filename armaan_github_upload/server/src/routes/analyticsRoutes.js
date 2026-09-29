const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticate, authorize } = require('../middleware/auth');

// Public tracking endpoint (used by public websites)
router.post('/track', analyticsController.trackEvent);

// Protected dashboard stats
router.get('/dashboard', authenticate, analyticsController.getDashboardStats);
router.get('/website/:id', authenticate, analyticsController.getWebsiteAnalytics);

// Admin platform stats
router.get('/admin-stats', authenticate, authorize('ADMIN'), analyticsController.getAdminStats);

module.exports = router;
