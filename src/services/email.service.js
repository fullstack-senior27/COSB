// const nodemailer = require('nodemailer');
// const config = require('../config/config');
// const logger = require('../config/logger');

// const transport = nodemailer.createTransport(config.email.smtp);
// /* istanbul ignore next */
// if (config.env !== 'test') {
//   transport
//     .verify()
//     .then(() => logger.info('Connected to email server'))
//     .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
// }

// /**
//  * Send an email
//  * @param {string} to
//  * @param {string} subject
//  * @param {string} text
//  * @returns {Promise}
//  */


// /**
//  * Send reset password email
//  * @param {string} to
//  * @param {string} token
//  * @returns {Promise}
//  */


// /**
//  * Send verification email
//  * @param {string} to
//  * @param {string} token
//  * @returns {Promise}
//  */




const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
const sendEmail = (to, subject, text, resetPasswordUrl) => {
  // const msg = { from: config.email.from, to, subject, text };
  const msg = {
    to,
    from: process.env.SEND_GRID_EMAIL_FROM, // Use the email address or domain you verified above
    subject,
    text,
    html: `<a href=${resetPasswordUrl}>Click here.</a>`,
  };
  sgMail
    .send(msg)
    .then(() => { }, error => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body)
      }
    });
}

const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text, resetPasswordUrl);
};

const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

module.exports = {
  sendResetPasswordEmail,
  sendVerificationEmail
};
