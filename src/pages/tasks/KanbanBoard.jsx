import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  FileText,
  ClipboardList,
} from "lucide-react";

import KanbanColumn from "../../components/tasks/KanbanColumn";

import {mockBoardSummary} from "../../data/mock/boardSummary"; 
import {mockColumns} from "../../data/mock/Columns";
import {mockTasks} from "../../data/mock/tasks";
import CreateTaskModal from "../../components/tasks/CreateTaskModal";
import CreateColumnModal from "../../components/tasks/CreateColumnModal";
import EditColumnModal from "../../components/tasks/EditColumnModal";
import ConfirmDialog from "../../components/tasks/ConfirmDialog"; 

import "./KanbanBoard.css";

const KanbanBoard = () => {
  const board = mockBoardSummary; // <-- using mockBoardSummary for board info

  const [searchText, setSearchText] = useState("");
  const [columns] = useState(mockColumns);
  const [tasks, setTasks] = useState(mockTasks); // <-- tasks now live in state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isCreateColumnModalOpen, setIsCreateColumnModalOpen] = useState(false);
  const [isEditColumnModalOpen, setIsEditColumnModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [columnToDelete, setColumnToDelete] = useState(null);

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

  const handleAddTask = (columnId) => {
    console.log("Add task to column:", columnId);
  };

  const handleEditColumn = (column) => {
    setSelectedColumn(column);
    setIsEditColumnModalOpen(true);
  };

  const handleDeleteColumn = (column) => {
    setColumnToDelete(column);
  };

  const confirmDeleteColumn = () => {
    // No DB connected yet — placeholder for future delete API call
    console.log("Confirmed delete for column:", columnToDelete);
    setColumnToDelete(null);
  };

  const cancelDeleteColumn = () => {
    setColumnToDelete(null);
  };

  const handleActivityLog = () => {
    console.log("Open activity log");
    setIsMenuOpen(false);
  };

  // Moves a task to a new column (and optional position within it)
  const handleTaskDrop = (taskId, targetColumnId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, columnId: targetColumnId }
          : task
      )
    );
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
            <strong>{board.totalTasks}</strong>
          </div>

          <div className="stat-card">
            <span>In progress</span>
            <strong>{board.inProgress}</strong>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <strong>{board.completed}</strong>
          </div>

          <div className="stat-card overdue">
            <span>Overdue</span>
            <strong>{board.overdue}</strong>
          </div>

        </section>


        {/* Kanban Columns */}
        <section className="kanban-board">

          {columns.map((column) => (
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
            />
          ))}

        </section>

      </main>

      {isCreateTaskModalOpen && (
          <CreateTaskModal
           isOpen={isCreateTaskModalOpen}
           onClose={() => setIsCreateTaskModalOpen(false)}
           onSave={(newTask) => {
          console.log("New task:", newTask);
      }}
  />
)}

{isCreateColumnModalOpen && (
  <CreateColumnModal
    isOpen={isCreateColumnModalOpen}
    onClose={() => setIsCreateColumnModalOpen(false)}
    onSave={(newColumn) => {
      console.log("New column:", newColumn);
    }}
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
    onSave={(newName) => {
      console.log("Updated column name:", newName);
    }}
  />
)}


<ConfirmDialog
        isOpen={!!columnToDelete}
        title="Delete column?"
        message={
          columnToDelete
            ? `Are you sure you want to delete "${columnToDelete.title}"? This action cannot be undone once connected to the database.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={confirmDeleteColumn}
        onCancel={cancelDeleteColumn}
      />

      
    </div>
  );
};

export default KanbanBoard;