import React, { useState, useRef, useEffect } from "react";
import "./CreateTaskModal.css";

const TASK_TYPES = [
  "Design",
  "Research",
  "Content",
  "QA",
  "Development",
  "Meeting",
];

const CreateTaskModal = ({ isOpen, onClose, onSave }) => {
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState("");
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const typeRef = useRef(null);

  useEffect(() => {
    if (!isTypeOpen) return;
    const handleClickOutside = (e) => {
      if (typeRef.current && !typeRef.current.contains(e.target)) {
        setIsTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTypeOpen]);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setTaskName("");
    setDueDate("");
    setType("");
    setIsTypeOpen(false);
    onClose();
  };

  const handleSave = () => {
    const trimmed = taskName.trim();
    if (!trimmed) return;
    onSave({ name: trimmed, dueDate, type });
    resetAndClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) resetAndClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") resetAndClose();
  };

  const canSave = taskName.trim().length > 0;

  return (
    <div className="ctm-overlay" onClick={handleOverlayClick}>
      <div className="ctm-modal" onKeyDown={handleKeyDown}>
        <button
          className="ctm-close-btn"
          onClick={resetAndClose}
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

        <div className="ctm-header">
          <h2 className="ctm-title">New Task</h2>

          <div className="ctm-illustration">
            <svg
              width="100"
              height="82"
              viewBox="0 0 110 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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

              <path
                d="M92 8l1.5 4L98 13.5 93.5 15 92 19l-1.5-4L86 13.5 90.5 12z"
                fill="#3B4CB8"
              />
              <path
                d="M101 22l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"
                fill="#3B4CB8"
              />

              <rect x="20" y="24" width="62" height="46" rx="6" fill="#1E2A5A" />

              <rect x="28" y="55" width="20" height="4" rx="2" fill="#8C97D9" />
              <path
                d="M28 65l10-4 10 4"
                stroke="#3B4CB8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              <rect x="46" y="18" width="36" height="32" rx="5" fill="#F2F4FA" />
              <circle cx="58" cy="30" r="5" fill="#3B4CB8" />
              <path d="M50 44c1.5-5 6-7 8-7s6.5 2 8 7" fill="#3B4CB8" />
              <rect x="70" y="24" width="7" height="2" rx="1" fill="#3B4CB8" />
              <rect x="70" y="29" width="7" height="2" rx="1" fill="#C7CEDB" />

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

        <div className="ctm-body">
          <div className="ctm-field">
            <label className="ctm-label" htmlFor="ctm-task-name">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect
                  x="2.5"
                  y="2.5"
                  width="11"
                  height="11"
                  rx="2"
                  fill="#171D3D"
                />
                <path
                  d="M5 8l2 2 4-4"
                  stroke="#fff"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Task Name
            </label>
            <input
              id="ctm-task-name"
              type="text"
              className="ctm-input"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="ctm-field">
            <label className="ctm-label" htmlFor="ctm-due-date">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect
                  x="2"
                  y="3.5"
                  width="12"
                  height="10.5"
                  rx="2"
                  stroke="#171D3D"
                  strokeWidth="1.3"
                />
                <path
                  d="M2 6.5h12M5 2v2.5M11 2v2.5"
                  stroke="#171D3D"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
              </svg>
              Due date
            </label>
            <input
              id="ctm-due-date"
              type="date"
              className="ctm-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="ctm-field ctm-type-field" ref={typeRef}>
            <button
              type="button"
              className="ctm-select"
              onClick={() => setIsTypeOpen((prev) => !prev)}
            >
              <span className={type ? "ctm-select-value" : "ctm-select-placeholder"}>
                {type || "Type"}
              </span>
              <svg
                className={`ctm-select-chevron ${isTypeOpen ? "ctm-select-chevron-open" : ""}`}
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M2.5 4.5L6 8l3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isTypeOpen && (
              <ul className="ctm-dropdown" role="listbox">
                {TASK_TYPES.map((option) => (
                  <li
                    key={option}
                    role="option"
                    aria-selected={type === option}
                    className={`ctm-dropdown-item ${
                      type === option ? "ctm-dropdown-item-selected" : ""
                    }`}
                    onClick={() => {
                      setType(option);
                      setIsTypeOpen(false);
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="ctm-footer">
          <button
            className="ctm-btn-save"
            onClick={handleSave}
            disabled={!canSave}
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;