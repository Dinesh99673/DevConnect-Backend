const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User,  Otp_verification } = require('../models'); 
const {mailer} = require("../Utils/mailer")

const { otpSignupTemplate, otpPasswordResetTemplate } = require("../Utils/Email-Templates/otpSignup")


// Handle user signup - create new user account
const signup = async (req, res) => {
  try {
    const {
      email,
      password,
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
   
    // 4. Create default user name. which user can change later.
    username = email.split("@")[0];

    // . Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      salt,
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

// Handle user login - authenticate and return JWT token
const login = async (req, res) => {
  const { email, password } = req.body;

  // Get user details by email
  const user = await User.findOne({ where: { email : email } });

  // If user not found, send error
  if (!user) return res.status(401).json({ msg: 'Invalid email / User does not exist' });

  // Compare hashed password in DB with hash of entered password + salt
  const match = await bcrypt.compare(password + user.salt, user.password);

  // If password mismatch, send error
  if (!match) return res.status(401).json({ msg: 'Invalid password' });

  // Generate JWT token with user id payload
  const token = jwt.sign({ userId: user.user_id, time: (new Date).toDateString() }, process.env.JWT_SECRET_KEY);

  // Send token in response
  res.json({ token, messagess:"Login successfull. Token sended" });
};

const otp_generation = async (req,res) =>{
  try{
    const {email }= req.body;
    const otp = await Math.floor(100000 + Math.random() * 90000);
    const hashed_otp = await bcrypt.hash(toString(otp),10);
    const newOtp = await Otp_verification.create({
      otp_hash:hashed_otp,
      email
    });
    console.log(newOtp);
    

    //send OTP through mail
    const {subject, text} = await otpSignupTemplate(otp);
    await mailer(email, subject, text);


    console.log(otp);
    res.send("OTP successfully sended on the Email :)");
  }catch(error){
    console.log(error);
    
    res.status(500).json({message:"Something went wrong. Please try again later"});
  }
}

const otp_verification = async (req,res) =>{

  const {otp, email} = req.body;
  const hashed_otp = await bcrypt.hash(toString(otp),10);
  const data = await Otp_verification.findOne({
      where: { email },
      order: [['createdAt', 'DESC']],
      attributes: ['email', 'otp_hash', 'createdAt']
    });
  const status = await bcrypt.compare(toString(otp),data.otp_hash);  
  res.json({data:data, status:status});
}

module.exports = {signup, login, otp_generation, otp_verification}