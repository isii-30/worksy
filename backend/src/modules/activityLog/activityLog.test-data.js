require("dotenv").config({ path: require("path").resolve(__dirname, "../../../.env") });

const mongoose = require("mongoose");
const { connectDb } = require("../../config/db");

const ActivityLog = require("./activityLog.model");

async function testActivityLogModel() {
  try {
    await connectDb();

    console.log("ActivityLog model loaded successfully");
    console.log("Model name:", ActivityLog.modelName);
    console.log("Collection name:", ActivityLog.collection.name);

    await mongoose.disconnect();
    console.log("MongoDB disconnected");

    process.exit(0);
  } catch (error) {
    console.error("ActivityLog model test failed:", error);
    process.exit(1);
  }
}

testActivityLogModel();