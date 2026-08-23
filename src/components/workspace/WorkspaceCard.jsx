import lockIcon from "../../assets/lock-icon.svg";
import personIcon from "../../assets/person-icon.svg";
import groupIcon from "../../assets/group-icon.svg";
import editIcon from "../../assets/edit-icon.svg";
import { memberAvatars } from "../../data/mock/workspaces";
import "./WorkspaceCard.css";

export default function WorkspaceCard({ workspace, onEdit, onOpen }) {
  return (
    <article className="workspace-box" onClick={() => onOpen?.(workspace)}>
      <div className="workspace-box-top">
        <span className="member-chip">
          <img src={personIcon} alt="" className="member-chip-icon" />
          {workspace.role}
        </span>

        {workspace.locked ? (
          <img src={lockIcon} alt="Locked" className="workspace-lock-icon" />
        ) : (
          <button
            className="workspace-edit-button"
            type="button"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            aria-label={`Edit ${workspace.name}`}
          >
            <img src={editIcon} alt="Edit" className="workspace-edit-icon" />
          </button>
        )}
      </div>

      <div
        className="workspace-avatar"
        style={{
          backgroundColor: workspace.color,
          color: workspace.textColor,
        }}
      >
        {workspace.initials}
      </div>

      <h2>{workspace.name}</h2>

      <div className="workspace-info">
        <img src={groupIcon} alt="" className="group-icon-svg" />
        <span>{workspace.members}</span>
        <span>|</span>
        <span>{workspace.visibility}</span>
      </div>

      <div className="member-avatars">
        {memberAvatars.map((avatar, index) => (
          <img
            src={avatar}
            alt="Member avatar"
            key={index}
            style={{ zIndex: index + 1 }}
          />
        ))}
        <span className="more-avatar">...</span>
      </div>

      <p className="workspace-description">{workspace.description}</p>
    </article>
  );
}