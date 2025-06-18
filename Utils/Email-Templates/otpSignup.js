const otpSignupTemplate = (otp) => {
    return {
        subject : "Verify Your Email - OTP Inside'",
        text : `
            Hi there,

            Thank you for signing up with DevConnect.
            Please verify your email using the OTP below:

            OTP : ${otp}

            This code will expire in 5 minutes. Do not share it with anyone.

            Welcome aboard!
            Team DevConnect :)
        `,
    }
}

module.exports = {otpSignupTemplate}