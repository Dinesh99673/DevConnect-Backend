const express = require('express');
const authenticate = require("../Middleware/authMiddleware")
const {getChattedUsers} = require("../Controller/useController")

const userRouter = express.Router();

// User signup route
userRouter.get('/chatted-users', authenticate, getChattedUsers);


module.exports = userRouter;
