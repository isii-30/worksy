import React, { useState } from "react";
import "./MemberRow.css";
import WorkspaceRoleSelector from "./WorkspaceRoleSelector";

function MemberRow({
  member,
  boards,
  onRoleChange,
  onBoardChange,
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

        {/* Board selector */}
        <select
          className="board-role-button"
          value={member.board || ""}
          onChange={(event) =>
            onBoardChange(member.id, event.target.value)
          }
        >
          <option value="" disabled>
            Board
          </option>

          {boards.map((board) => (
            <option key={board} value={board}>
              {board}
            </option>
          ))}
        </select>

        {/* Workspace role selector */}
        <WorkspaceRoleSelector
          role={member.role}
          onChange={(newRole) =>
            onRoleChange(member.id, newRole)
          }
        />

        {/* More menu */}
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