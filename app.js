const express = require('express');
const authRouter = require('./Routes/authRoutes.js');

const app = express();

app.use(express.json());


// Route handling
app.use('/auth', authRouter);      // Signup & login

module.exports = app;