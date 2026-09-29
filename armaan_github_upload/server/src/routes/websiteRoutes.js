const express = require('express');
const router = express.Router();
const websiteController = require('../controllers/websiteController');
const { authenticate } = require('../middleware/auth');

// Public route for viewing published websites
router.get('/public/:slug', websiteController.getPublicWebsiteBySlug);

// Protected routes for owners/admin
router.get('/', authenticate, websiteController.getWebsites);
router.get('/:id', authenticate, websiteController.getWebsiteById);
router.post('/', authenticate, websiteController.createWebsite);
router.put('/:id', authenticate, websiteController.updateWebsite);
router.post('/:id/publish', authenticate, websiteController.publishWebsite);
router.post('/:id/unpublish', authenticate, websiteController.unpublishWebsite);
router.delete('/:id', authenticate, websiteController.deleteWebsite);

module.exports = router;
