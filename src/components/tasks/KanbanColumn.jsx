import React, { useState } from "react";
import { MoreVertical, Pencil, Trash2, Plus, GripVertical } from "lucide-react";

import TaskCard from "./TaskCard";
import "./KanbanColumn.css";

// Custom MIME type used to tell a "reorder columns" drag apart from a
// "move task between columns" drag on the same drop target.
const COLUMN_DND_TYPE = "application/x-kanban-column";

const KanbanColumn = ({
  column,
  tasks,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
  onTaskDrop,
  onDeleteTask,
  onColumnDrop,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isBeingDragged, setIsBeingDragged] = useState(false);

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

    // A whole column being dropped to reorder it
    const draggedColumnId = e.dataTransfer.getData(COLUMN_DND_TYPE);
    if (draggedColumnId) {
      onColumnDrop?.(Number(draggedColumnId), column.id);
      return;
    }

    // Otherwise, a task card being dropped into this column
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      onTaskDrop?.(Number(taskId), column.id);
    }
  };

  const handleColumnDragStart = (e) => {
    e.dataTransfer.setData(COLUMN_DND_TYPE, String(column.id));
    e.dataTransfer.effectAllowed = "move";
    setIsBeingDragged(true);
  };

  const handleColumnDragEnd = () => {
    setIsBeingDragged(false);
  };

  return (
    <div
      className={`kanban-column column-${column.color} ${
        isDragOver ? "drag-over" : ""
      } ${isBeingDragged ? "column-dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >

      <div
        className="column-header"
        draggable
        onDragStart={handleColumnDragStart}
        onDragEnd={handleColumnDragEnd}
      >

        <div className="column-title">
          <GripVertical size={14} className="column-drag-handle" />
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
            onDeleteTask={onDeleteTask}
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