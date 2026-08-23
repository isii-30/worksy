import React from "react";
import { CalendarDays, MoreVertical, Check } from "lucide-react";

import "./TaskCard.css";

const TaskCard = ({ task, onDragStart, onDragEnd }) => {
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
          <MoreVertical size={16} className="task-menu-icon" />
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