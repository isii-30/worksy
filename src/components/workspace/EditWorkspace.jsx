import { useEffect, useState } from "react";
import { modalIllustration } from "../../data/mock/workspaces";
import "./EditWorkspace.css";

export default function EditWorkspace({
  workspace,
  onClose,
  onSave,
  onDelete,
}) {
  const [name, setName] = useState(workspace ? workspace.name : "");
  const [description, setDescription] = useState(
    workspace ? workspace.description : ""
  );

  useEffect(() => {
    if (workspace) {
      setName(workspace.name || "");
      setDescription(workspace.description || "");
    }
  }, [workspace]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;

    onSave({
      name,
      description,
    });
  };

  return (
    <div className="edit-workspace-overlay" onClick={onClose}>
      <form
        className="edit-workspace-modal"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="edit-workspace-close"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="edit-workspace-header">
          <div>
            <h2>Edit Your Workspace</h2>
            <p>
              Update your workspace details and keep your team organized
            </p>
          </div>

          <img
            src={modalIllustration}
            alt="Illustration"
            className="edit-workspace-image"
          />
        </div>

        <label className="edit-workspace-label">
          <span className="edit-workspace-label-icon">👤</span>
          Workspace Name
        </label>

        <input
          className="edit-workspace-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Marketing Team"
          required
        />

        <label className="edit-workspace-label edit-workspace-description-label">
          <span className="edit-workspace-label-icon">📄</span>
          About this workspace
        </label>

        <textarea
          className="edit-workspace-textarea"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What is this workspace for?"
        />

        <div className="edit-workspace-actions">
          <button className="edit-workspace-save" type="submit">
            ✓ Save Changes
          </button>

          <button
            className="edit-workspace-delete"
            type="button"
            onClick={onDelete}
          >
            🗑 Delete Workspace
          </button>
        </div>
      </form>
    </div>
  );
}
