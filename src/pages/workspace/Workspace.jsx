import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ManageMembersModal from "../../components/members/ManageMembersModal";
import WorkspaceCard from "../../components/workspace/WorkspaceCard";
import CreateWorkspace from "../../components/workspace/CreateWorkspace";
import EditWorkspace from "../../components/workspace/EditWorkspace";
import { initialWorkspaces } from "../../data/mock/workspaces";
import addIcon from "../../assets/add-icon.svg";
import searchIconSvg from "../../assets/search-icon.svg";
import "./Workspace.css";

export default function Workspace() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState(initialWorkspaces);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [managingMembersWorkspace, setManagingMembersWorkspace] = useState(null);

  const filteredWorkspaces = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return workspaces;

    return workspaces.filter((workspace) =>
      workspace.name.toLowerCase().includes(q)
    );
  }, [search, workspaces]);

  const handleCreate = ({ name, description }) => {
    const cleanName = name.trim() || "New Workspace";

    const initials = cleanName
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");

    const nextId =
      workspaces.length > 0
        ? Math.max(...workspaces.map((workspace) => workspace.id)) + 1
        : 1;

    const newWorkspace = {
      id: nextId,
      initials: initials || "NW",
      name: cleanName,
      members: 1,
      visibility: "Public",
      role: "Owner",
      locked: false,
      description: description.trim() || "A new workspace for your team.",
      color: "rgba(184,192,198,0.8)",
      textColor: "#24313A",
    };

    setWorkspaces((current) => [...current, newWorkspace]);
    setShowCreate(false);
  };

  const handleSave = ({ name, description }) => {
    if (!editingWorkspace) return;

    setWorkspaces((current) =>
      current.map((workspace) =>
        workspace.id === editingWorkspace.id
          ? {
              ...workspace,
              name: name.trim() || workspace.name,
              description: description.trim() || workspace.description,
            }
          : workspace
      )
    );

    setEditingWorkspace(null);
  };

  const handleDelete = () => {
    if (!editingWorkspace) return;

    setWorkspaces((current) =>
      current.filter((workspace) => workspace.id !== editingWorkspace.id)
    );

    setEditingWorkspace(null);
  };

  return (
    <div className="workspace-page">

      {/* Main Panel */}
      <div className="workspace-main-panel">
        <div className="workspace-main-scroll">
          {/* Toolbar */}
          <div className="workspace-toolbar">
            <button className="back-button" title="Back">
              &#8249;
            </button>

            <div className="search-box">
              <img src={searchIconSvg} alt="" className="search-icon" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search workspaces..."
              />
            </div>

            <button
              className="new-workspace-button"
              onClick={() => setShowCreate(true)}
            >
              <img src={addIcon} alt="" className="add-icon" />
              <span className="new-workspace-label">New Workspace</span>
            </button>
          </div>

          {/* Title */}
          <div className="workspace-title-row">
            <h1 className="workspace-title">My Workspace</h1>
          </div>

          {/* Cards grid */}
          <section className="workspace-grid">
            {filteredWorkspaces.map((workspace) => (
              <WorkspaceCard
                key={workspace.id}
                workspace={workspace}
                onEdit={() => setEditingWorkspace(workspace)}
                onOpen={(w) => navigate(`/boards?workspace=${w.id}`)}
                onManageMembers={setManagingMembersWorkspace}
              />
            ))}

            <button
              className="create-workspace-box"
              onClick={() => setShowCreate(true)}
            >
              <span className="create-workspace-plus">+</span>
              <span className="create-workspace-label">Create Workspace</span>
            </button>
          </section>
        </div>
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateWorkspace
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}

      {editingWorkspace && (
        <EditWorkspace
          workspace={editingWorkspace}
          onClose={() => setEditingWorkspace(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      {managingMembersWorkspace && (
        <ManageMembersModal onClose={() => setManagingMembersWorkspace(null)} />
      )}
    </div>
  );
}