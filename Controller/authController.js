const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models'); 


// Handle user signup - create new user account
async function signup (req, res){
  try {
    const {
      username,
      email,
      password,
      bio,
      description,
      profile_image_url,
      github_url,
      portfolio_url,
    } = req.body;

    // 1. Check if user already exists
    const existing = await User.findOne({ where: { email : email } });
    if (existing) {
      return res.status(409).json({ msg: 'User already exists' });
    }

    // 2. Generate salt value of 4digit
    const salt = await Math.floor(1000 + Math.random() * 9000);
    console.log(salt);

    // 3. Hash password with salt
    const hashedPassword = await bcrypt.hash(password+ salt,10);

    // 4. Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      salt,
      bio,
      description,
      profile_image_url,
      github_url,
      portfolio_url,
    });

    // 6. Send response
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Signup failed', error });
  } 
};

module.exports = {signup}