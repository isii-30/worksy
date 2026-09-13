const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  isRead: {
    type: Boolean,
    default: false,
  },

  entityType: {
    type: String,
    required: true,
  },

  entityId: {
    type: mongoose.Schema.Types.ObjectId,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);