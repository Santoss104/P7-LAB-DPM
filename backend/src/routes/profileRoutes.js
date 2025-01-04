const express = require('express');
const ProfileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * GET /api/profile
 * @summary Get user profile
 * @tags Profile
 * @return {object} 200 - User profile data
 * @return {object} 500 - Server error
 */
router.get('/', authMiddleware, ProfileController.getProfile);

module.exports = router;