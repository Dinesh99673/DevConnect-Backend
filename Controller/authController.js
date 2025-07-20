const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User,  Otp_verification } = require('../models'); 
const {mailer} = require("../Utils/mailer")

const { otpSignupTemplate } = require("../Utils/Email-Templates/otpSignup")
const { otpPasswordResetTemplate } = require("../Utils/Email-Templates/otpReset")

// Handle user signup - create new user account
const signup = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;
    const {time} = req.data
    
    //checking the existance of token
    const otpCreatdAt = new Date(time)
    const otpExpireAt = new Date(otpCreatdAt.getTime()+(5*60*1000))
    const currentTimestamp = new Date()
    
    if(otpExpireAt<currentTimestamp){
      return res.status(406).json({message:"OTP Expired", status:false})
    }

    // 1. Check if user already exists
    const existing = await User.findOne({ where: { email : email } });
    if (existing) {
      return res.status(409).json({ msg: 'User already exists' });
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password,10);
   
    // 3. Create default user name. which user can change later.
    username = email.split("@")[0];

    //4. Create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword
    });

    // 5. Send response
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
    return res.status(500).json({ msg: 'Signup failed' });
  } 
};

// Handle user login - authenticate and return JWT token
const login = async (req, res) => {
  try{
    const { email, password } = req.body;

    // Get user details by email
    const user = await User.findOne({ where: { email : email } });

    // If user not found, send error
    if (!user) return res.status(401).json({ msg: 'Invalid email / User does not exist' });

    // Compare hashed password in DB with hash of entered password + salt
    const match = await bcrypt.compare(password, user.password);

    // If password mismatch, send error
    if (!match) return res.status(401).json({ msg: 'Invalid password' });

    // Generate JWT token with user id payload
    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '30d' } // auto expiry
    );
    // Send token in response
    res.json({ token, messagess:"Login successfull. Token sended" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Login failed' });
  } 
};

//Handle OTP generation - create 6-digit otp and send via email
const otp_generation = async (req,res) =>{
  try{
    const {email, purpose }= req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
    const hashed_otp = await bcrypt.hash(otp,10);

    console.log(hashed_otp);
    
    
    const templates = {
      ["signup"]: otpSignupTemplate,
      ["password reset"]: otpPasswordResetTemplate
    };
    //Check purpose is right or not. And get the respective template.
    const templateFn = templates[purpose]
    if (!templateFn){
      return res.status(401).json({message:"Invalid OTP purpose !"});
    }

    //Store the OTP in database
    const newOtp = await Otp_verification.create({
      otp_hash:hashed_otp,
      email,
      purpose
    });
    console.log(newOtp);

    const {subject, text} = await templateFn(otp);
    await mailer(email, subject, text);
  

    console.log(otp);
    return res.status(200).json({message:"OTP successfully sended :)"});
  }catch(error){
    console.log(error);
    return res.status(500).json({message:"Something went wrong. Please try again later"});
  }
}

//Handle OTP verification - checks the OTP entered by user is right or not.
const otp_verification = async (req,res) =>{
try{
    const {otp, email} = req.body;
    const data = await Otp_verification.findOne({
      where: { email },
      order: [['createdAt', 'DESC']],
      attributes: ['email', 'otp_hash', 'createdAt']
    });
    const status = await bcrypt.compare(otp.toString(),data.otp_hash);
    console.log(`status ${status} and otp = ${data.otp_hash}/`);
    
    if (!status){
      return res.status(401).json({message:"Wrong OTP. Please try again later.", status:status}); 
    }
    
    //Created objects which will contain the expiry timestamp and current timestamp
    const otpCreatdAt = new Date(data.createdAt)
    const otpExpireAt = new Date(otpCreatdAt.getTime()+(5*60*1000))
    const currentTimestamp = new Date()
    if(otpExpireAt<currentTimestamp){
      return res.status(406).json({message:"OTP Expired", status:false})
    }

    //Create JWT token with email and cuurrent timestamp
    const token = jwt.sign({ email: data.email, time: data.createdAt }, process.env.JWT_SECRET_KEY);

    return res.status(200).json({token:token, message:"OTP verified successfully.", status: true})
  }catch(error){
    console.log(error);
    
    return res.status(500).json({message:"Something went wrong !"})
  }
}

// Handle Reset-password
const reset_password = async (req, res) => {
  try {
    const {
      email,
      newPassword
    } = req.body;
    const {time} = req.data
    
    //checking the existance of token
    const otpCreatdAt = new Date(time)
    const otpExpireAt = new Date(otpCreatdAt.getTime()+(5*60*1000))
    const currentTimestamp = new Date()
    
    if(otpExpireAt<currentTimestamp){
      return res.status(406).json({message:"OTP Expired try again later", status:false})
    }

    // 1. Check if user exist or not
    const existing = await User.findOne({ where: { email : email } });
    if (!existing) {
      return res.status(409).json({ msg: "User wih the given email doesn't exists" });
    }

    // 2. Hash password 
    const newHashedPassword = await bcrypt.hash(newPassword,10);
   
    //3. Update password
    const updatedUser = await User.update(
      { password: newHashedPassword },      
      { where: { email: email } } 
    );

    // 4. Send response
    res.status(201).json({
      message: 'Password changed successfully',
      user: {
        id: updatedUser[0].id,
        username: updatedUser[0].username,
        email: updatedUser[0].email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Password Reset failed' });
  } 
};

module.exports = {signup, login, otp_generation, otp_verification, reset_password}