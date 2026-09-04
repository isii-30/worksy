const mongoose = require("mongoose");

// WORKSPACE_MEMBER collection
// Owned by: Membership module (Isira)
// A join between a user and a workspace, with their role in that workspace.
const memberSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace", // must match Senuja's model name exactly
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // must match Senali's model name exactly
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "member"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // adds createdAt / updatedAt automatically; we keep joinedAt as our own field
    timestamps: false,
  }
);

// The model name "WorkspaceMember" is what other people put in ref: "WorkspaceMember"
module.exports = mongoose.model("WorkspaceMember", memberSchema);