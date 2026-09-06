require("dotenv").config();

const mongoose = require("mongoose");
const Notification = require("./notification.model");

async function createTestNotifications() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    const testUserId = new mongoose.Types.ObjectId();

    const notifications = await Notification.insertMany([
      {
        recipient: testUserId,
        type: "deadline",
        title: "Create wireframes",
        isRead: false,
        entityType: "Task",
        entityId: new mongoose.Types.ObjectId(),
      },
      {
        recipient: testUserId,
        type: "task_created",
        title: "New Task Created",
        isRead: true,
        entityType: "Task",
        entityId: new mongoose.Types.ObjectId(),
      },
      {
        recipient: testUserId,
        type: "member_joined",
        title: "A new member joined the workspace",
        isRead: false,
        entityType: "Workspace",
        entityId: new mongoose.Types.ObjectId(),
      },
    ]);

    console.log(
      `${notifications.length} test notifications created successfully.`
    );

    notifications.forEach((notification) => {
      console.log(
        "Notification ID:",
        notification._id.toString()
      );
    });

    console.log(
      "Test User ID:",
      testUserId.toString()
    );

    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  } catch (error) {
    console.error(
      "Error creating test notifications:",
      error
    );
  }
}

createTestNotifications();