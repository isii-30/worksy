import React, { useState } from "react";
import { MoreVertical, Pencil, Trash2, Plus } from "lucide-react";

import TaskCard from "./TaskCard";
import "./KanbanColumn.css";

const KanbanColumn = ({
  column,
  tasks,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
  onTaskDrop,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault(); // required to allow dropping
    e.dataTransfer.dropEffect = "move";
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    // only clear if we're actually leaving the column, not moving between children
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      onTaskDrop?.(Number(taskId), column.id);
    }
  };

  return (
    <div
      className={`kanban-column column-${column.color} ${
        isDragOver ? "drag-over" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >

      <div className="column-header">

        <div className="column-title">
          <h2>{column.title}</h2>
          <span>{column.count}</span>
        </div>

        <div className="column-actions">
          <Trash2
            size={13}
            onClick={() => onDeleteColumn(column)}
          />

          <Pencil
            size={13}
            onClick={() => onEditColumn(column)}
          />
        </div>

      </div>

      <div className="column-tasks">
        {tasks.map((task) => (
          <TaskCard
            task={task}
            key={task.id}
          />
        ))}
      </div>

      {/* {column.id === 1 && (
        <button
          className="add-task-button"
          onClick={() => onAddTask(column.id)}
        >
          <Plus size={21} />
          <span>Add Task</span>
        </button>
      )}    */}
  
    </div>
  );
};

export default KanbanColumn;