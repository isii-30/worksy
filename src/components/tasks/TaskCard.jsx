import React, { useEffect, useRef, useState } from "react";
import { CalendarDays, MoreVertical, Check, Trash2 } from "lucide-react";

import "./TaskCard.css";

const TaskCard = ({ task, onDragStart, onDragEnd, onDeleteTask }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleDelete = () => {
    setIsMenuOpen(false);
    onDeleteTask?.(task);
  };

  return (
    <div
      className="task-card"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", String(task.id));
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.(task);
      }}
      onDragEnd={() => onDragEnd?.()}
    >

      <div className="task-card-top">
        <h3>{task.title}</h3>

        {task.completed ? (
          <div className="completed-icon">
            <Check size={15} strokeWidth={3} />
          </div>
        ) : (
          <div className="task-menu-wrapper" ref={menuRef}>
            <MoreVertical
              size={16}
              className="task-menu-icon"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            />

            {isMenuOpen && (
              <ul className="task-menu-dropdown" role="menu">
                <li
                  className="task-menu-dropdown-item"
                  role="menuitem"
                  onClick={handleDelete}
                >
                  <Trash2 size={13} />
                  Delete
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="task-card-bottom">

        <span
          className={`task-category category-${task.categoryColor}`}
        >
          {task.category}
        </span>

        <div className="task-date">
          <CalendarDays size={11} strokeWidth={2.5} />
          <span>{task.dueDate}</span>
        </div>

      </div>

    </div>
  );
};

export default TaskCard;