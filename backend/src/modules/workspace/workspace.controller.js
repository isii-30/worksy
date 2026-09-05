const workspaceService = require("./workspace.service");

const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await workspaceService.getAllWorkspaces();

    res.status(200).json({
      success: true,
      data: workspaces,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch workspaces.",
    });
  }
};

const getWorkspace = async (req, res) => {
  try {
    const workspace = await workspaceService.getWorkspaceById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    res.status(200).json({
      success: true,
      data: workspace,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch workspace.",
    });
  }
};

const createWorkspace = async (req, res) => {
  try {
    const workspace = await workspaceService.createWorkspace(req.body);

    res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      data: workspace,
    });
  } catch (err) {
    // service throws for missing/invalid name or createdBy
    res.status(400).json({
      success: false,
      message: err.message || "Failed to create workspace.",
    });
  }
};

const updateWorkspace = async (req, res) => {
  try {
    const workspace = await workspaceService.updateWorkspace(
      req.params.id,
      req.body
    );

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Workspace updated successfully",
      data: workspace,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to update workspace.",
    });
  }
};

const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await workspaceService.deleteWorkspace(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
      data: workspace,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete workspace.",
    });
  }
};

module.exports = {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
};