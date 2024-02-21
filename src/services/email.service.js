const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
const sendEmail = (to, subject, text) => {
  // const msg = { from: config.email.from, to, subject, text };
  const msg = {
    to,
    from: process.env.SEND_GRID_EMAIL_FROM, // Use the email address or domain you verified above
    subject,
    text,
    // html: `<a href=${resetPasswordUrl}>Click here.</a>`,
  };
  sgMail.send(msg).then(
    () => {},
    (error) => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  );
};

const sendResetPasswordEmail = async (to, otp) => {
  const subject = 'Reset password OTP';
  // replace this url with the link to the reset password page of your front-end app
  // const resetPasswordUrl = `https://indi-sync-backend.onrender.com/v1/auth/reset-password?token=${token}`;
  //   const text = `Dear user,
  // To reset your password, click on this link: ${resetPasswordUrl}
  // If you did not request any password resets, then ignore this email.`;
  const text = `Dear user, here's your OTP to reset password ${otp}`;
  await sendEmail(to, subject, text);
};

const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `https://indi-sync-backend.onrender.com/v1/auth/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text, verificationEmailUrl);
};

module.exports = {
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendEmail,
};
