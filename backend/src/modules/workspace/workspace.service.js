const mongoose = require("mongoose");
const Workspace = require("./workspace.model");

// Get all workspaces
const getAllWorkspaces = async () => {
  return Workspace.find().sort({ createdAt: -1 });
};

// Get workspace by ID
const getWorkspaceById = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }

  return Workspace.findById(id);
};

// Create workspace
const createWorkspace = async (data) => {
  const name = data.name?.trim();

  if (!name) {
    throw new Error("Workspace name is required");
  }

  if (!data.createdBy) {
    throw new Error("createdBy is required");
  }

  if (!mongoose.isValidObjectId(data.createdBy)) {
    throw new Error("Invalid createdBy user ID");
  }

  const workspace = new Workspace({
    name,
    description: data.description?.trim() || "",
    createdBy: data.createdBy,
  });

  return workspace.save();
};

// Update workspace
const updateWorkspace = async (id, data) => {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }

  const updates = {};

  if (data.name !== undefined) {
    const name = data.name.trim();

    if (!name) {
      throw new Error("Workspace name cannot be empty");
    }

    updates.name = name;
  }

  if (data.description !== undefined) {
    updates.description = data.description.trim();
  }

  return Workspace.findByIdAndUpdate(
    id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  );
};

// Delete workspace
const deleteWorkspace = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    return null;
  }

  return Workspace.findByIdAndDelete(id);
};

module.exports = {
  getAllWorkspaces,
  getWorkspaceById,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
};