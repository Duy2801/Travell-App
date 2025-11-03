const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');
const pick = require('../utils/pick');

const createNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.createNotification(req.body);
  res.status(httpStatus.CREATED).send(notification);
});

const getNotifications = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['type', 'isRead', 'priority']);
  filter.userId = req.user.id; // Only get current user's notifications
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await notificationService.queryNotifications(filter, options);
  res.send(result);
});

const getNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.getNotificationById(req.params.notificationId);
  res.send(notification);
});

const markAsRead = catchAsync(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.notificationId);
  res.send(notification);
});

const markAllAsRead = catchAsync(async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);
  res.send({ message: 'All notifications marked as read' });
});

const deleteNotification = catchAsync(async (req, res) => {
  await notificationService.deleteNotification(req.params.notificationId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getUnreadCount = catchAsync(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user.id);
  res.send({ count });
});

module.exports = {
  createNotification,
  getNotifications,
  getNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
