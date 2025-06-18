const nodemailer = require('nodemailer');
const dotenv = require("dotenv")


const mailer = (receiver, subject, text) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_ID,       // Your Gmail address
        pass: process.env.APP_PASSWORD           // App password (NOT your Gmail password)
    }
    });

    // Email options
    const mailOptions = {
    from: process.env.MAIL_ID,
    to: receiver,
    subject: subject,
    text: text,
    };

    // Send email
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log('Error occurred:',  error);
    } else {
        console.log('Email sent:', info.response);
    }
    });

}

module.exports = {mailer}