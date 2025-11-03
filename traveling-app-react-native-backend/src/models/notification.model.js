const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['booking', 'system', 'service', 'promotion', 'reminder'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      // Can reference booking, service, tour, etc.
    },
    relatedType: {
      type: String,
      enum: ['booking', 'tour', 'service', 'hotel', 'review'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal',
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      // Additional data for the notification
    },
  },
  { timestamps: true }
);

// Add indexes
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

// Add plugins
notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginate);

module.exports = mongoose.model('Notification', notificationSchema);
