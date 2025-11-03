const httpStatus = require('http-status');
const Notification = require('../models/notification.model');
const ApiError = require('../utils/ApiError');

/**
 * Create a notification
 * @param {Object} notificationBody
 * @returns {Promise<Notification>}
 */
const createNotification = async (notificationBody) => {
  return Notification.create(notificationBody);
};

/**
 * Query for notifications
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
const queryNotifications = async (filter, options) => {
  const notifications = await Notification.paginate(filter, options);
  return notifications;
};

/**
 * Get notification by id
 * @param {ObjectId} id
 * @returns {Promise<Notification>}
 */
const getNotificationById = async (id) => {
  return Notification.findById(id);
};

/**
 * Mark notification as read
 * @param {ObjectId} notificationId
 * @returns {Promise<Notification>}
 */
const markAsRead = async (notificationId) => {
  const notification = await getNotificationById(notificationId);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }
  notification.isRead = true;
  await notification.save();
  return notification;
};

/**
 * Mark all notifications as read for a user
 * @param {ObjectId} userId
 * @returns {Promise}
 */
const markAllAsRead = async (userId) => {
  await Notification.updateMany({ userId, isRead: false }, { isRead: true });
};

/**
 * Delete notification by id
 * @param {ObjectId} notificationId
 * @returns {Promise<Notification>}
 */
const deleteNotification = async (notificationId) => {
  const notification = await getNotificationById(notificationId);
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found');
  }
  await notification.remove();
  return notification;
};

/**
 * Get unread count for a user
 * @param {ObjectId} userId
 * @returns {Promise<Number>}
 */
const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ userId, isRead: false });
};

/**
 * Create booking notification
 * @param {ObjectId} userId
 * @param {Object} bookingData
 * @param {String} status
 */
const createBookingNotification = async (userId, bookingData, status) => {
  let title = '';
  let message = '';
  let priority = 'normal';

  switch (status) {
    case 'created':
      title = '🎉 Đặt tour thành công!';
      message = `Bạn đã đặt tour "${bookingData.tourName}" thành công. Mã đặt tour: ${bookingData.bookingId}`;
      priority = 'high';
      break;
    case 'confirmed':
      title = '✅ Booking được xác nhận';
      message = `Booking ${bookingData.bookingId} của bạn đã được xác nhận. Chúc bạn có chuyến đi vui vẻ!`;
      priority = 'high';
      break;
    case 'cancelled':
      title = '❌ Booking bị hủy';
      message = `Booking ${bookingData.bookingId} đã bị hủy. Vui lòng liên hệ để biết thêm chi tiết.`;
      priority = 'high';
      break;
    case 'completed':
      title = '🏆 Hoàn thành chuyến đi';
      message = `Cảm ơn bạn đã sử dụng dịch vụ! Hãy đánh giá trải nghiệm của bạn.`;
      priority = 'normal';
      break;
    default:
      title = '📬 Cập nhật booking';
      message = `Có cập nhật mới cho booking ${bookingData.bookingId}`;
  }

  return createNotification({
    userId,
    type: 'booking',
    title,
    message,
    relatedId: bookingData.bookingId,
    relatedType: 'booking',
    priority,
    data: bookingData,
  });
};

/**
 * Create system notification
 * @param {ObjectId} userId
 * @param {String} title
 * @param {String} message
 */
const createSystemNotification = async (userId, title, message, data = {}) => {
  return createNotification({
    userId,
    type: 'system',
    title: `📢 ${title}`,
    message,
    priority: 'normal',
    data,
  });
};

/**
 * Create service notification
 * @param {ObjectId} userId
 * @param {Object} serviceData
 */
const createServiceNotification = async (userId, serviceData) => {
  return createNotification({
    userId,
    type: 'service',
    title: '🎁 Dịch vụ mới cho bạn!',
    message: `${serviceData.name} - Trải nghiệm ngay với giá ${serviceData.price.toLocaleString('vi-VN')}₫`,
    relatedId: serviceData.serviceId,
    relatedType: 'service',
    priority: 'low',
    data: serviceData,
  });
};

/**
 * Create promotion notification
 * @param {ObjectId} userId
 * @param {Object} promotionData
 */
const createPromotionNotification = async (userId, promotionData) => {
  return createNotification({
    userId,
    type: 'promotion',
    title: '🎊 Ưu đãi đặc biệt!',
    message: promotionData.message,
    priority: 'normal',
    data: promotionData,
  });
};

module.exports = {
  createNotification,
  queryNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  createBookingNotification,
  createSystemNotification,
  createServiceNotification,
  createPromotionNotification,
};
