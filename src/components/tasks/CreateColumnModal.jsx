import React, { useState } from "react";
import "./CreateColumnModal.css";

const CreateColumnModal = ({ isOpen, onClose, onCreate }) => {
  const [columnName, setColumnName] = useState("");

  if (!isOpen) return null;

  const handleCreate = () => {
    const trimmed = columnName.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setColumnName("");
    onClose();
  };

  const handleCancel = () => {
    setColumnName("");
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleCreate();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <div className="ccm-overlay" onClick={handleOverlayClick}>
      <div className="ccm-modal">
        <button
          className="ccm-close-btn"
          onClick={handleCancel}
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 4L4 12M4 4l8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="ccm-header">
          <div className="ccm-header-text">
            <h2 className="ccm-title">Create Column</h2>
            <p className="ccm-subtitle">
              Create new column and keep your team organized
            </p>
          </div>

          <div className="ccm-illustration">
            <svg
              width="110"
              height="90"
              viewBox="0 0 110 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* dotted grid */}
              <g fill="#C7CEDB">
                {[0, 1, 2].map((row) =>
                  [0, 1, 2].map((col) => (
                    <circle
                      key={`${row}-${col}`}
                      cx={8 + col * 9}
                      cy={8 + row * 9}
                      r="2"
                    />
                  ))
                )}
              </g>

              {/* sparkles */}
              <path
                d="M92 8l1.5 4L98 13.5 93.5 15 92 19l-1.5-4L86 13.5 90.5 12z"
                fill="#3B4CB8"
              />
              <path
                d="M101 22l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"
                fill="#3B4CB8"
              />

              {/* envelope back */}
              <rect
                x="20"
                y="24"
                width="62"
                height="46"
                rx="6"
                fill="#1E2A5A"
              />

              {/* inner lines */}
              <rect x="28" y="55" width="20" height="4" rx="2" fill="#8C97D9" />
              <path
                d="M28 65l10-4 10 4"
                stroke="#3B4CB8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* people card */}
              <rect
                x="46"
                y="18"
                width="36"
                height="32"
                rx="5"
                fill="#F2F4FA"
              />
              <circle cx="58" cy="30" r="5" fill="#3B4CB8" />
              <path
                d="M50 44c1.5-5 6-7 8-7s6.5 2 8 7"
                fill="#3B4CB8"
              />
              <rect x="70" y="24" width="7" height="2" rx="1" fill="#3B4CB8" />
              <rect x="70" y="29" width="7" height="2" rx="1" fill="#C7CEDB" />

              {/* plus circle */}
              <circle cx="83" cy="55" r="9" fill="#3B4CB8" />
              <path
                d="M83 51v8M79 55h8"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <div className="ccm-body">
          <label className="ccm-label" htmlFor="ccm-column-name">
            <svg
              className="ccm-label-icon"
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M2 4a1 1 0 011-1h3.5l1.2 1.5H13a1 1 0 011 1V12a1 1 0 01-1 1H3a1 1 0 01-1-1V4z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
            Column Name
          </label>
          <input
            id="ccm-column-name"
            type="text"
            className="ccm-input"
            placeholder=""
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>

        <div className="ccm-footer">
          <button className="ccm-btn ccm-btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button
            className="ccm-btn ccm-btn-create"
            onClick={handleCreate}
            disabled={!columnName.trim()}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateColumnModal;