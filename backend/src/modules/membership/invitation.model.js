const mongoose = require("mongoose");

// WORKSPACE_INVITATION collection
// Owned by: Membership module (Isira)
// An invitation for a user to join a workspace.
const invitationSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    invitedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // the person being invited
      required: true,
    },
    invitedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // the person who sent the invite
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "member"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "cancelled"],
      default: "pending",
    },
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  {
    // gives us createdAt (and updatedAt) automatically
    timestamps: true,
  }
);

module.exports = mongoose.model("WorkspaceInvitation", invitationSchema);