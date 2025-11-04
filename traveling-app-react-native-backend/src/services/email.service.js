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
  const text = `Xin chào ${bookingData.userName || 'Khách hàng'},

Booking của bạn đã được XÁC NHẬN!

📋 THÔNG TIN ĐÂT TOUR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mã đặt tour: ${bookingData.bookingId}
Tour: ${bookingData.tourName}
Ngày khởi hành: ${bookingData.startDate || ''}
Số người: ${bookingData.numberOfPeople || ''} người
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Chúc mừng! Chuyến đi của bạn đã được xác nhận.

Vui lòng chuẩn bị:
• CMND/CCCD bản gốc
• Giấy tờ cần thiết cho chuyến đi
• Liên hệ nếu có thắc mắc: support@travelapp.com

Chúc bạn có một chuyến đi tuyệt vời!

Trân trọng,
Travel App Team`;
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
      text = `Xin chào ${bookingData.userName || 'Khách hàng'},

Booking của bạn đã được XÁC NHẬN!

📋 THÔNG TIN ĐÂT TOUR:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mã đặt tour: ${bookingData.bookingId}
Tour: ${bookingData.tourName}
Ngày khởi hành: ${bookingData.startDate || ''}
Số người: ${bookingData.numberOfPeople || ''} người
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Chúc mừng! Chuyến đi của bạn đã được xác nhận.

Vui lòng chuẩn bị:
• CMND/CCCD bản gốc
• Giấy tờ cần thiết cho chuyến đi
• Liên hệ nếu có thắc mắc: support@travelapp.com

Chúc bạn có một chuyến đi tuyệt vời!

Trân trọng,
Travel App Team`;
      break;
    case 'cancelled':
      subject = '❌ Thông báo hủy booking - Travel App';
      text = `Xin chào ${bookingData.userName || 'Khách hàng'},

Booking của bạn đã bị HỦY.

📋 THÔNG TIN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mã đặt tour: ${bookingData.bookingId}
Tour: ${bookingData.tourName}
Lý do: ${bookingData.cancelReason || 'Theo yêu cầu'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ:
📧 Email: support@travelapp.com
📞 Hotline: 1900 xxxx

Rất tiếc vì sự bất tiện này. Mong được phục vụ bạn trong tương lai!

Trân trọng,
Travel App Team`;
      break;
    case 'completed':
      subject = '🏆 Cảm ơn bạn đã sử dụng dịch vụ - Travel App';
      text = `Xin chào ${bookingData.userName || 'Khách hàng'},

Chuyến đi của bạn đã hoàn thành!

📋 THÔNG TIN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mã đặt tour: ${bookingData.bookingId}
Tour: ${bookingData.tourName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!

⭐ Vui lòng dành chút thời gian đánh giá trải nghiệm của bạn tại ứng dụng.
Ý kiến của bạn giúp chúng tôi cải thiện dịch vụ tốt hơn.

Hẹn gặp lại bạn trong những chuyến đi tiếp theo!

Trân trọng,
Travel App Team`;
      break;
    default:
      subject = '📬 Cập nhật booking - Travel App';
      text = `Xin chào ${bookingData.userName || 'Khách hàng'},

Có cập nhật mới cho booking ${bookingData.bookingId} của bạn.

Vui lòng kiểm tra trong ứng dụng để biết thêm chi tiết.

Trân trọng,
Travel App Team`;
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
