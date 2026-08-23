import { useState } from "react";
import { modalIllustration } from "../../data/mock/workspaces";
import "./CreateWorkspace.css";

export default function CreateWorkspace({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name.trim()) return;

    onCreate({
      name,
      description,
    });
  };

  return (
    <div className="create-workspace-overlay" onClick={onClose}>
      <form
        className="create-workspace-modal"
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="create-workspace-close"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="create-workspace-header">
          <div>
            <h2>Create Your Workspace</h2>
            <p>Set up your workspace details to get started.</p>
          </div>

          <img
            src={modalIllustration}
            alt="Illustration"
            className="create-workspace-image"
          />
        </div>

        <label className="create-workspace-label">
          <span className="create-workspace-label-icon">👤</span>
          Workspace Name
        </label>

        <input
          className="create-workspace-input"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Marketing Team"
          required
        />

        <label className="create-workspace-label create-workspace-description-label">
          <span className="create-workspace-label-icon">📄</span>
          Workspace Description
        </label>

        <textarea
          className="create-workspace-textarea"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe your workspace in a few words"
        />

        <p className="create-workspace-helper">
          This helps us optimize your experience
        </p>

        <button className="create-workspace-submit" type="submit">
          ✓ Create Workspace
        </button>

        <p className="create-workspace-footer">
          You can invite team members after creating the workspace
        </p>
      </form>
    </div>
  );
}
