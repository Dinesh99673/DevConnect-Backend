const express = require('express');
const authenticate = require("../Middleware/authMiddleware")
const  {signup, login, otp_generation, otp_verification, reset_password}= require('../Controller/authController');

const authRouter = express.Router();

// User signup route
authRouter.post('/signup', authenticate, signup);
authRouter.post('/login', login);
authRouter.post('/otp-generation', otp_generation);
authRouter.post('/otp-verification', otp_verification);
authRouter.post('/reset-password', authenticate, reset_password);

module.exports = authRouter;
