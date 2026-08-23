import React, { useState } from "react";
import "./MemberRow.css";
import WorkspaceRoleSelector from "./WorkspaceRoleSelector";

function MemberRow({
  member,
  onRoleChange,
  onDelete,
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="member-row">

      <div className="member-info">

        <div className="member-avatar">
          {member.image ? (
            <img src={member.image} alt={member.name} />
          ) : (
            member.name.charAt(0)
          )}
        </div>

        <span className="member-name">
          {member.name}
        </span>

      </div>

      <div className="member-role-area">

        {/* Keep this visually as "Board" */}
        <select
          className="board-role-button"
          defaultValue="Board"
        >
          <option value="Board">Board</option>
          <option value="Board 1">Board 1</option>
          <option value="Board 2">Board 2</option>
        </select>

        <WorkspaceRoleSelector
          role={member.role}
          onChange={(newRole) =>
            onRoleChange(member.id, newRole)
          }
        />

        <div className="member-menu-container">

          <button
            className="member-more-button"
            onClick={() => setShowMenu(!showMenu)}
          >
            ⋮
          </button>

          {showMenu && (
            <div className="member-dropdown-menu">
              <button
                onClick={() => {
                  setShowMenu(false);
                  onDelete(member);
                }}
              >
                Delete
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default MemberRow;