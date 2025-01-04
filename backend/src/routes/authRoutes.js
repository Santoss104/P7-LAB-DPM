const express = require('express');
const AuthController = require('../controllers/authController');
const router = express.Router();

const authController = new AuthController();

/**
 * @typedef {object} RegisterRequest
 * @property {string} username.required - Username
 * @property {string} password.required - Password
 * @property {string} email.required - Email
 */

/**
 * @typedef {object} LoginRequest
 * @property {string} username.required - Username
 * @property {string} password.required - Password
 */

/**
 * POST /api/auth/register
 * @summary Register a new user
 * @tags Auth
 * @param {RegisterRequest} request.body.required - User info
 * @return {object} 201 - User registered successfully
 * @return {object} 400 - Username already exists
 * @return {object} 500 - Server error
 */
router.post('/register', authController.register);

/**
 * POST /api/auth/login
 * @summary Login a user
 * @tags Auth
 * @param {LoginRequest} request.body.required - User info
 * @return {object} 200 - Login successful
 * @return {object} 401 - Invalid credentials
 * @return {object} 500 - Server error
 */
router.post('/login', authController.login);

module.exports = router;