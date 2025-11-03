const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text) => {
  const msg = { from: config.email.from, to, subject, text };
  try {
    logger.info(`Sending email to ${to} - subject: ${subject}`);
    const info = await transport.sendMail(msg);
    logger.info(`Email sent to ${to} (messageId=${info.messageId})`);
    return info;
  } catch (err) {
    logger.error(`Error sending email to ${to}: ${err && err.message ? err.message : err}`);
    throw err;
  }
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send booking confirmation email
 * @param {string} to
 * @param {Object} bookingData
 * @returns {Promise}
 */
const sendBookingConfirmationEmail = async (to, bookingData) => {
  const subject = '🎉 Xác nhận đặt tour thành công - Travel App';
  const text = `Xin chào ${bookingData.userName || ''},\n\nCảm ơn bạn đã đặt tour với chúng tôi!\n\nMã đặt tour: ${bookingData.bookingId}\nTour: ${bookingData.tourName}\nNgày khởi hành: ${bookingData.startDate || ''}\nSố người: ${bookingData.numberOfPeople || ''}\nTổng tiền: ${bookingData.totalPrice || ''}\n\nTrân trọng,\nTravel App Team`;
  return sendEmail(to, subject, text);
};

/**
 * Send booking status update email
 * @param {string} to
 * @param {Object} bookingData
 * @param {string} status - 'confirmed', 'cancelled', 'completed'
 * @returns {Promise}
 */
const sendBookingStatusUpdateEmail = async (to, bookingData, status) => {
  let subject = '';
  let text = '';
  switch (status) {
    case 'confirmed':
      subject = '✅ Booking của bạn đã được xác nhận - Travel App';
      text = `Xin chào ${bookingData.userName || ''},\n\nBooking ${bookingData.bookingId} của bạn đã được xác nhận.\n\nTrân trọng,\nTravel App Team`;
      break;
    case 'cancelled':
      subject = '❌ Thông báo hủy booking - Travel App';
      text = `Xin chào ${bookingData.userName || ''},\n\nBooking ${bookingData.bookingId} đã bị hủy.\n\nTrân trọng,\nTravel App Team`;
      break;
    case 'completed':
      subject = '🏆 Cảm ơn bạn đã sử dụng dịch vụ - Travel App';
      text = `Xin chào ${bookingData.userName || ''},\n\nChuyến đi của bạn đã hoàn thành. Cảm ơn bạn!\n\nTrân trọng,\nTravel App Team`;
      break;
    default:
      subject = '📬 Cập nhật booking - Travel App';
      text = `Xin chào ${bookingData.userName || ''},\n\nCó cập nhật cho booking ${bookingData.bookingId}.\n\nTrân trọng,\nTravel App Team`;
  }
  return sendEmail(to, subject, text);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendBookingConfirmationEmail,
  sendBookingStatusUpdateEmail,
};
