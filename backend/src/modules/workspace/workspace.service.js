const workspaces = require("../../data/mock/workspaces");

const getAllWorkspaces = () => {
  return workspaces;
};

const getWorkspaceById = (id) => {
  return workspaces.find(
    (workspace) => workspace.id === Number(id)
  );
};

const createWorkspace = (data) => {
  const name = data.name?.trim() || "New Workspace";

  const nextId =
    workspaces.length > 0
      ? Math.max(...workspaces.map((workspace) => workspace.id)) + 1
      : 1;

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  const newWorkspace = {
    id: nextId,
    initials: initials || "NW",
    name,
    members: 1,
    visibility: data.visibility || "Public",
    role: "Owner",
    locked: false,
    description:
      data.description?.trim() ||
      "A new workspace for your team.",
    color: data.color || "rgba(184,192,198,0.8)",
    textColor: data.textColor || "#24313A",
  };

  workspaces.push(newWorkspace);

  return newWorkspace;
};

const updateWorkspace = (id, data) => {
  const workspace = getWorkspaceById(id);

  if (!workspace) {
    return null;
  }

  if (data.name) {
    workspace.name = data.name.trim() || workspace.name;
  }

  if (data.description !== undefined) {
    workspace.description =
      data.description.trim() || workspace.description;
  }

  if (data.visibility !== undefined) {
    workspace.visibility = data.visibility;
  }

  return workspace;
};

const deleteWorkspace = (id) => {
  const index = workspaces.findIndex(
    (workspace) => workspace.id === Number(id)
  );

  if (index === -1) {
    return null;
  }

  return workspaces.splice(index, 1)[0];
};

module.exports = {
  getAllWorkspaces,
  getWorkspaceById,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
};