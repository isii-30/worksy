import React, { useState, useRef, useEffect } from "react";
import "./WorkspaceRoleSelector.css";

function WorkspaceRoleSelector({ role, onChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const roles = ["Admin", "Member"];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (newRole) => {
    onChange(newRole);
    setOpen(false);
  };

  return (
    <div
      className={`workspace-role-selector-wrapper ${
        role === "Admin" ? "admin-role" : "member-role"
      }`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className="workspace-role-selector"
        onClick={() => setOpen(!open)}
      >
        <span>{role}</span>
        <span className="role-arrow">⌄</span>
      </button>

      {open && (
        <div className="workspace-role-dropdown">
          {roles.map((item) => (
            <button
              type="button"
              key={item}
              className={`workspace-role-option ${
                item === role ? "selected" : ""
              }`}
              onClick={() => handleSelect(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkspaceRoleSelector;