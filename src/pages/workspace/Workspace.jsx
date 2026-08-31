import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ManageMembersModal from "../../components/members/ManageMembersModal";
import WorkspaceCard from "../../components/workspace/WorkspaceCard";
import CreateWorkspace from "../../components/workspace/CreateWorkspace";
import EditWorkspace from "../../components/workspace/EditWorkspace";
import addIcon from "../../assets/add-icon.svg";
import searchIconSvg from "../../assets/search-icon.svg";
import "./Workspace.css";

const API_URL = "http://localhost:5000/api/workspace";

export default function Workspace() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [managingMembersWorkspace, setManagingMembersWorkspace] = useState(null);
  
  useEffect(() => {
  const fetchWorkspaces = async () => {
    try {
      const response = await fetch(API_URL);
      const result = await response.json();

      if (result.success) {
        setWorkspaces(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
    }
  };

  fetchWorkspaces();
}, []);

  const filteredWorkspaces = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return workspaces;

    return workspaces.filter((workspace) =>
      workspace.name.toLowerCase().includes(q)
    );
  }, [search, workspaces]);

  const handleCreate = async ({ name, description }) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
      }),
    });

    const result = await response.json();

    if (result.success) {
      setWorkspaces((current) => [...current, result.data]);
      setShowCreate(false);
    }
  } catch (error) {
    console.error("Failed to create workspace:", error);
  }
};

 const handleSave = async ({ name, description }) => {
  if (!editingWorkspace) return;

  try {
    const response = await fetch(
      `${API_URL}/${editingWorkspace.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      setWorkspaces((current) =>
        current.map((workspace) =>
          workspace.id === editingWorkspace.id
            ? result.data
            : workspace
        )
      );

      setEditingWorkspace(null);
    }
  } catch (error) {
    console.error("Failed to update workspace:", error);
  }
};
const handleDelete = async () => {
  if (!editingWorkspace) return;

  try {
    const response = await fetch(
      `${API_URL}/${editingWorkspace.id}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (result.success) {
      setWorkspaces((current) =>
        current.filter(
          (workspace) => workspace.id !== editingWorkspace.id
        )
      );

      setEditingWorkspace(null);
    }
  } catch (error) {
    console.error("Failed to delete workspace:", error);
  }
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