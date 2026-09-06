
import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  GripVertical,
} from "lucide-react";

import TaskCard from "./TaskCard";
import "./KanbanColumn.css";

const COLUMN_DND_TYPE =
  "application/x-kanban-column";

const KanbanColumn = ({
  column,
  tasks,
  onEditColumn,
  onDeleteColumn,
  onTaskDrop,
  onDeleteTask,
  onColumnDrop,
}) => {
  const [isDragOver, setIsDragOver] =
    useState(false);

  const [isBeingDragged, setIsBeingDragged] =
    useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();

    e.dataTransfer.dropEffect = "move";

    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    if (
      !e.currentTarget.contains(
        e.relatedTarget
      )
    ) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    // Column reordering
    const draggedColumnId =
      e.dataTransfer.getData(
        COLUMN_DND_TYPE
      );

    if (draggedColumnId) {
      onColumnDrop?.(
        draggedColumnId,
        String(column.id)
      );

      return;
    }

    // Task moving
    const taskId =
      e.dataTransfer.getData(
        "text/plain"
      );

    if (taskId) {
      onTaskDrop?.(
        taskId,
        String(column.id)
      );
    }
  };

  const handleColumnDragStart = (e) => {
    e.dataTransfer.setData(
      COLUMN_DND_TYPE,
      String(column.id)
    );

    e.dataTransfer.effectAllowed = "move";

    setIsBeingDragged(true);
  };

  const handleColumnDragEnd = () => {
    setIsBeingDragged(false);
  };

  return (
    <div
      className={`kanban-column column-${column.color} ${
        isDragOver
          ? "drag-over"
          : ""
      } ${
        isBeingDragged
          ? "column-dragging"
          : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className="column-header"
        draggable
        onDragStart={
          handleColumnDragStart
        }
        onDragEnd={
          handleColumnDragEnd
        }
      >
        <div className="column-title">
          <GripVertical
            size={14}
            className="column-drag-handle"
          />

          <h2>{column.title}</h2>

          <span>{column.count}</span>
        </div>

        <div className="column-actions">
          <Trash2
            size={13}
            onClick={() =>
              onDeleteColumn?.(column)
            }
          />

          <Pencil
            size={13}
            onClick={() =>
              onEditColumn?.(column)
            }
          />
        </div>
      </div>

      <div className="column-tasks">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;

