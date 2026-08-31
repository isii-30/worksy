const workspaceService = require("./workspace.service");

const getWorkspaces = (req, res) => {
  const workspaces = workspaceService.getAllWorkspaces();

  res.status(200).json({
    success: true,
    data: workspaces,
  });
};

const getWorkspace = (req, res) => {
  const workspace = workspaceService.getWorkspaceById(req.params.id);

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
};

const createWorkspace = (req, res) => {
  const workspace = workspaceService.createWorkspace(req.body);

  res.status(201).json({
    success: true,
    message: "Workspace created successfully",
    data: workspace,
  });
};

const updateWorkspace = (req, res) => {
  const workspace = workspaceService.updateWorkspace(
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
};

const deleteWorkspace = (req, res) => {
  const workspace = workspaceService.deleteWorkspace(req.params.id);

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
};

module.exports = {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
};