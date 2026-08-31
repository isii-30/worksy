import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  FileText,
  ClipboardList,
} from "lucide-react";

import KanbanColumn from "../../components/tasks/KanbanColumn";

import {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
} from "../../services/columnService";

import CreateTaskModal from "../../components/tasks/CreateTaskModal";
import CreateColumnModal from "../../components/tasks/CreateColumnModal";
import EditColumnModal from "../../components/tasks/EditColumnModal";
import ConfirmDialog from "../../components/tasks/ConfirmDialog"; 

import { getTasks, createTask, deleteTask, moveTask } from "../../services/taskService";

import "./KanbanBoard.css";

// Maps a task "type" (from CreateTaskModal) to the pill color used by TaskCard
const CATEGORY_COLORS = {
  Design: "blue",
  Research: "green",
  Content: "orange",
  QA: "red",
  Development: "purple",
  Meeting: "gray",
};

// Formats a yyyy-mm-dd input date into the short "Aug 18" style used elsewhere
const formatDueDate = (isoDate) => {
  if (!isoDate) return "";
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// Parses the short "Aug 18" style due date (no year) against a reference
// year to get a real Date. Returns null if it can't be parsed.
const parseDueDate = (dueDate, referenceYear) => {
  if (!dueDate) return null;
  const parsed = new Date(`${dueDate} ${referenceYear}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const KanbanBoard = () => {
  const [searchText, setSearchText] = useState("");
  const [columns, setColumns] = useState([]);
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateColumnModalOpen, setIsCreateColumnModalOpen] = useState(false);
  const [isEditColumnModalOpen, setIsEditColumnModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [columnToDelete, setColumnToDelete] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const menuRef = useRef(null);

useEffect(() => {
  const loadBoardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [columnsData, tasksData] = await Promise.all([
        getColumns("b1"),
        getTasks("b1"),
      ]);

      setColumns(columnsData);
      setTasks(tasksData);
    } catch (error) {
      console.error(error);
      setError("Failed to load board data");
    } finally {
      setLoading(false);
    }
  };

  loadBoardData();
}, []);

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

  const filteredTasks = useMemo(() => {
    if (!searchText.trim()) {
      return tasks;
    }

    return tasks.filter((task) =>
      task.title
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }, [tasks, searchText]);

  // Live board stats, derived from the actual tasks/columns instead of mock data
  const boardStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;

    const progressColumnIds = columns
      .filter((column) => column.color === "progress")
      .map((column) => column.id);
    const inProgress = tasks.filter((task) =>
      progressColumnIds.includes(task.columnId)
    ).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const referenceYear = today.getFullYear();

    const overdue = tasks.filter((task) => {
      if (task.completed) return false;
      const dueDate = parseDueDate(task.dueDate, referenceYear);
      if (!dueDate) return false;
      return dueDate < today;
    }).length;

    return { totalTasks, inProgress, completed, overdue };
  }, [tasks, columns]);

  // Columns with their task count derived live from `tasks`, so counts
  // update instantly on create/delete/move without an extra API round-trip
  const columnsWithCounts = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      count: tasks.filter((task) => task.columnId === column.id).length,
    }));
  }, [columns, tasks]);

  const handleAddTask = (columnId) => {
    console.log("Add task to column:", columnId);
  };

  // Creates a task and drops it into the "To do" column (columnId 1),
  // matching the backend default when no columnId is sent.
  const handleCreateTask = async (newTask) => {
    try {
      const task = await createTask("b1", {
        title: newTask.name,
        dueDate: formatDueDate(newTask.dueDate),
        category: newTask.type || "Development",
        categoryColor: CATEGORY_COLORS[newTask.type] || "purple",
        columnId: 1,
      });

      setTasks((prevTasks) => [...prevTasks, task]);

      setIsCreateTaskModalOpen(false);
    } catch (error) {
      console.error("Failed to create task:", error);
      setError(error.message);
    }
  };

  const handleCreateColumn = async (columnName) => {
  try {
    const newColumn = await createColumn("b1", {
      title: columnName,
    });

    setColumns((prevColumns) => [
      ...prevColumns,
      newColumn,
    ]);

    setIsCreateColumnModalOpen(false);
  } catch (error) {
    console.error("Failed to create column:", error);
    setError(error.message);
  }
};

  const handleEditColumn = (column) => {
    setSelectedColumn(column);
    setIsEditColumnModalOpen(true);
  };

  const handleUpdateColumn = async (newName) => {
  if (!selectedColumn) return;

  try {
    const updatedColumn = await updateColumn(
      selectedColumn.id,
      {
        title: newName,
      }
    );

    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === updatedColumn.id
          ? updatedColumn
          : column
      )
    );

    setIsEditColumnModalOpen(false);
    setSelectedColumn(null);
  } catch (error) {
    console.error("Failed to update column:", error);
    setError(error.message);
  }
};

  const handleDeleteColumn = (column) => {
    setColumnToDelete(column);
  };

 const confirmDeleteColumn = async () => {
  if (!columnToDelete) return;
  if (columnToDelete.count > 0) return;

  try {
    await deleteColumn(columnToDelete.id);

    setColumns((prevColumns) =>
      prevColumns.filter(
        (column) => column.id !== columnToDelete.id
      )
    );

    setColumnToDelete(null);
  } catch (error) {
    console.error("Failed to delete column:", error);
    setError(error.message);
  }
};

  const cancelDeleteColumn = () => {
    setColumnToDelete(null);
  };

  const handleActivityLog = () => {
    console.log("Open activity log");
    setIsMenuOpen(false);
  };

  // Moves a task to a new column (and optional position within it)
  const handleTaskDrop = async (taskId, targetColumnId) => {
  try {
    const updatedTask = await moveTask(
      taskId,
      targetColumnId
    );

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id
          ? updatedTask
          : task
      )
    );
  } catch (error) {
    console.error("Failed to move task:", error);
  }
  };

  // Reorders columns client-side by moving the dragged column to sit
  // where the target column currently is (no backend "order" field yet,
  // so this is kept in local state only, same as filteredTasks etc.)
  const handleColumnDrop = (draggedColumnId, targetColumnId) => {
    if (draggedColumnId === targetColumnId) return;

    setColumns((prevColumns) => {
      const fromIndex = prevColumns.findIndex(
        (column) => column.id === draggedColumnId
      );
      const toIndex = prevColumns.findIndex(
        (column) => column.id === targetColumnId
      );

      if (fromIndex === -1 || toIndex === -1) return prevColumns;

      const updated = [...prevColumns];
      const [movedColumn] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedColumn);

      return updated;
    });
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      await deleteTask(taskToDelete.id);

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== taskToDelete.id)
      );

      setTaskToDelete(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
      setError(error.message);
    }
  };

  const cancelDeleteTask = () => {
    setTaskToDelete(null);
  };

  return (
    <div className="kanban-page">

      

      <main className="kanban-main">

        {/* Top Header */}
        <header className="board-header">

          <h1>Task Board</h1>

          <div className="board-header-actions">

            <div className="search-box">
              <Search size={14} />

              <input
                type="text"
                placeholder="Search tasks..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <button
                className="header-button"
                 onClick={() => setIsCreateColumnModalOpen(true)}
            >
              <Plus size={18} />
              <span>New Column</span>
            </button>

            <button
                className="header-button"
                  onClick={() => setIsCreateTaskModalOpen(true)}
             >
                <Plus size={18} />
                <span>New Task</span>
            </button>

            <div className="header-more-wrapper" ref={menuRef}>
              <button
                className="header-more-btn"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label="More options"
              >
                <MoreVertical size={20} />
              </button>

              {isMenuOpen && (
                <ul className="header-more-menu" role="menu">
                  <li
                    className="header-more-menu-item"
                    role="menuitem"
                    onClick={handleActivityLog}
                  >
                    <ClipboardList size={16} />
                    Activity Log
                  </li>
                </ul>
              )}
            </div>

          </div>

        </header>


        {/* Board Information */}
        <section className="board-summary">

          <div className="board-name">

            <div className="board-document-icon">
              <FileText size={31} strokeWidth={2} />
            </div>

            <h2>
              Full Stack
              <br />
              Project
            </h2>

          </div>


          <div className="stat-card">
            <span>Total tasks</span>
            <strong>{boardStats.totalTasks}</strong>
          </div>

          <div className="stat-card">
            <span>In progress</span>
            <strong>{boardStats.inProgress}</strong>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <strong>{boardStats.completed}</strong>
          </div>

          <div className="stat-card overdue">
            <span>Overdue</span>
            <strong>{boardStats.overdue}</strong>
          </div>

        </section>


        {/* Kanban Columns */}
        <section className="kanban-board">

          {columnsWithCounts.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={filteredTasks.filter(
                (task) => task.columnId === column.id
              )}
              onAddTask={handleAddTask}
              onEditColumn={handleEditColumn}
              onDeleteColumn={handleDeleteColumn}
              onTaskDrop={handleTaskDrop}
              onDeleteTask={handleDeleteTask}
              onColumnDrop={handleColumnDrop}
            />
          ))}

        </section>

      </main>

      {isCreateTaskModalOpen && (
          <CreateTaskModal
           isOpen={isCreateTaskModalOpen}
           onClose={() => setIsCreateTaskModalOpen(false)}
           onSave={handleCreateTask}
  />
)}

{isCreateColumnModalOpen && (
  <CreateColumnModal
  isOpen={isCreateColumnModalOpen}
  onClose={() => setIsCreateColumnModalOpen(false)}
  onCreate={handleCreateColumn}
/>
)}


{isEditColumnModalOpen && selectedColumn && (
  <EditColumnModal
    isOpen={isEditColumnModalOpen}
    initialName={selectedColumn.title}
    onClose={() => {
      setIsEditColumnModalOpen(false);
      setSelectedColumn(null);
    }}
    onSave={handleUpdateColumn}
  />
)}

<ConfirmDialog
        isOpen={!!columnToDelete}
        title="Delete column?"
        message={
          columnToDelete
            ? columnToDelete.count > 0
              ? `"${columnToDelete.title}" still has ${columnToDelete.count} task${columnToDelete.count === 1 ? "" : "s"}. Remove or move all tasks out of this column before deleting it.`
              : `Are you sure you want to delete "${columnToDelete.title}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        confirmDisabled={!!columnToDelete && columnToDelete.count > 0}
        onConfirm={confirmDeleteColumn}
        onCancel={cancelDeleteColumn}
      />

      <ConfirmDialog
        isOpen={!!taskToDelete}
        title="Delete task?"
        message={
          taskToDelete
            ? `Are you sure you want to delete "${taskToDelete.title}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={confirmDeleteTask}
        onCancel={cancelDeleteTask}
      />


    </div>
  );
};

export default KanbanBoard;