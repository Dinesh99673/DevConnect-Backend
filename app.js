const express = require('express');
const authRouter = require('./Routes/authRoutes.js');
const userRouter = require('./Routes/userRoutes.js')
const cors = require('cors')

const app = express();

app.use(express.json());
app.use(cors())


// Route handling
app.use('/auth', authRouter);      // Signup, login & reset-password
app.use('/user',userRouter);       // User related Endpoints
module.exports = app;