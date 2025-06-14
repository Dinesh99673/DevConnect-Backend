const express = require('express');
const router = require('./Routes/authRoutes.js');

const app = express();

app.use(express.json());


// Route handling
app.use('/auth', router);      // Signup & login

module.exports = app;