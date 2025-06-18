const express = require('express');
const  {signup, login, otp_generation, otp_verification}= require('../Controller/authController');

const authRouter = express.Router();

// User signup route
authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/otp-generation', otp_generation);
authRouter.post('/otp-verification', otp_verification);


module.exports = authRouter;
