const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const notificationValidation = require('../../validations/notification.validation');
const notificationController = require('../../controllers/notification.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(notificationValidation.createNotification), notificationController.createNotification)
  .get(auth(), validate(notificationValidation.getNotifications), notificationController.getNotifications);

router.route('/unread-count').get(auth(), notificationController.getUnreadCount);

router.route('/mark-all-read').patch(auth(), notificationController.markAllAsRead);

router
  .route('/:notificationId')
  .get(auth(), validate(notificationValidation.getNotification), notificationController.getNotification)
  .delete(auth(), validate(notificationValidation.deleteNotification), notificationController.deleteNotification);

router
  .route('/:notificationId/read')
  .patch(auth(), validate(notificationValidation.markAsRead), notificationController.markAsRead);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management and retrieval
 */

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Create a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - type
 *               - title
 *               - message
 *             properties:
 *               userId:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [booking, system, service, promotion, reminder]
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               relatedId:
 *                 type: string
 *               relatedType:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, normal, high]
 *     responses:
 *       "201":
 *         description: Created
 *   get:
 *     summary: Get all notifications for current user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       "200":
 *         description: OK
 */
