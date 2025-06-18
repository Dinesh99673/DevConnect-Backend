const otpPasswordResetTemplate = (otp) => {
    return {
        subject : "Reset Your Password - OTP Inside",
        text : ` 
            Hi,

            We received a request to reset your password.
            Use the OTP below to proceed:

            OTP: ${otp}

            This OTP will expire in 5 minutes. If you did not initiate this request, you can safely ignore this email.

            Stay secure,
            Team DevConnect :)
        `,
    }
}

module.exports = {otpPasswordResetTemplate}