const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, authController.updateProfile);

// Admin user management
router.get('/users', authenticate, authorize('ADMIN'), authController.getUsers);
router.put('/users/:id/status', authenticate, authorize('ADMIN'), authController.toggleUserStatus);

module.exports = router;
