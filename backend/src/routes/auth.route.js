const express = require("express")
const authController = require("../controllers/auth.controller.js")

const authRouter = express.Router()

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 * @access  Public
 */
authRouter.post("/register", authController.registerController)

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return token
 * @access  Public
 */
authRouter.post("/login", authController.loginController)

module.exports = authRouter
