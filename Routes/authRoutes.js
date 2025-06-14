const express = require('express');
const  {signup}= require('../Controller/authController');

const router = express.Router();

// User signup route
router.post('/signup', signup);


module.exports = router;
