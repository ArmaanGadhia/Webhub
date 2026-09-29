const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const { authenticate } = require('../middleware/auth');

// Public route for enquiry submission from websites
router.post('/', enquiryController.createEnquiry);

// Protected routes for dashboard
router.get('/', authenticate, enquiryController.getEnquiries);
router.put('/:id', authenticate, enquiryController.updateEnquiryStatus);
router.delete('/:id', authenticate, enquiryController.deleteEnquiry);

module.exports = router;
