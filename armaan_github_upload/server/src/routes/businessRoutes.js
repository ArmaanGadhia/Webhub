const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', businessController.getBusinesses);
router.get('/my/business', authenticate, businessController.getMyBusiness);
router.get('/:identifier', businessController.getBusinessByIdOrSlug);

router.post('/', authenticate, businessController.createBusiness);
router.put('/:id', authenticate, businessController.updateBusiness);
router.delete('/:id', authenticate, businessController.deleteBusiness);

// Admin status route
router.put('/:id/status', authenticate, authorize('ADMIN'), businessController.updateBusinessStatus);

module.exports = router;
