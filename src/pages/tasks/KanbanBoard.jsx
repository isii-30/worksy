
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Search,
  Plus,
  MoreVertical,
  FileText,
  ClipboardList,
} from "lucide-react";

import { useParams } from "react-router-dom";

import KanbanColumn from "../../components/tasks/KanbanColumn";

import {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
} from "../../services/columnService";

import {
  getTasks,
  createTask,
  deleteTask,
  moveTask,
} from "../../services/taskService";

import { boardService } from "../../services/boardService";

import CreateTaskModal from "../../components/tasks/CreateTaskModal";
import CreateColumnModal from "../../components/tasks/CreateColumnModal";
import EditColumnModal from "../../components/tasks/EditColumnModal";
import ConfirmDialog from "../../components/tasks/ConfirmDialog";

import "./KanbanBoard.css";

// Same user ID currently used by BoardList.jsx
const CURRENT_USER_ID =
  "64f000000000000000000099";

const KanbanBoard = () => {
  const { boardId } = useParams();

  const [board, setBoard] = useState(null);

  const [searchText, setSearchText] =
    useState("");

  const [columns, setColumns] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const [
    isCreateTaskModalOpen,
    setIsCreateTaskModalOpen,
  ] = useState(false);

  const [
    isCreateColumnModalOpen,
    setIsCreateColumnModalOpen,
  ] = useState(false);

  const [
    isEditColumnModalOpen,
    setIsEditColumnModalOpen,
  ] = useState(false);

  const [selectedColumn, setSelectedColumn] =
    useState(null);

  const [columnToDelete, setColumnToDelete] =
    useState(null);

  const [taskToDelete, setTaskToDelete] =
    useState(null);

  const menuRef = useRef(null);

  /*
   * Load:
   * 1. Board information
   * 2. Columns belonging to this board
   * 3. Tasks belonging to this board
   */
  useEffect(() => {
    const loadBoardData = async () => {
      if (!boardId) {
        setError("Board ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [
          boardData,
          columnsData,
          tasksData,
        ] = await Promise.all([
          boardService.getBoardById(boardId),
          getColumns(boardId),
          getTasks(boardId),
        ]);

        setBoard(boardData);
        setColumns(columnsData);
        setTasks(tasksData);
      } catch (error) {
        console.error(
          "Failed to load board data:",
          error
        );

        setError(
          error.message ||
            "Failed to load board data"
        );
      } finally {
        setLoading(false);
      }
    };

    loadBoardData();
  }, [boardId]);

  /*
   * Close more-options menu when clicking
   * outside of it.
   */
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [isMenuOpen]);

  /*
   * Search tasks
   */
  const filteredTasks = useMemo(() => {
    if (!searchText.trim()) {
      return tasks;
    }

    return tasks.filter((task) =>
      task.title
        .toLowerCase()
        .includes(
          searchText.toLowerCase()
        )
    );
  }, [tasks, searchText]);

  /*
   * Board statistics
   */
  const boardStats = useMemo(() => {
    const totalTasks =
      tasks.length;

    const completed =
      tasks.filter(
        (task) => task.completed
      ).length;

    const progressColumnIds =
      columns
        .filter(
          (column) =>
            column.color ===
            "progress"
        )
        .map(
          (column) => column.id
        );

    const inProgress =
      tasks.filter((task) =>
        progressColumnIds.includes(
          task.columnId
        )
      ).length;

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const overdue =
      tasks.filter((task) => {
        if (task.completed) {
          return false;
        }

        if (!task.dueDate) {
          return false;
        }

        const dueDate =
          new Date(
            `${task.dueDate}T00:00:00`
          );

        if (
          Number.isNaN(
            dueDate.getTime()
          )
        ) {
          return false;
        }

        return dueDate < today;
      }).length;

    return {
      totalTasks,
      inProgress,
      completed,
      overdue,
    };
  }, [tasks, columns]);

  /*
   * Calculate task count for every column.
   */
  const columnsWithCounts =
    useMemo(() => {
      return columns.map(
        (column) => ({
          ...column,

          count: tasks.filter(
            (task) =>
              task.columnId ===
              column.id
          ).length,
        })
      );
    }, [columns, tasks]);

  /*
   * Create task
   */
  const handleCreateTask =
    async (newTask) => {
      if (!boardId) {
        setError(
          "Board ID is missing"
        );
        return;
      }

      try {
        /*
         * New tasks go into the first
         * available column.
         */
        if (columns.length === 0) {
          throw new Error(
            "Create a column before creating a task"
          );
        }

        const firstColumn =
          columns[0];

        const task =
          await createTask(
            boardId,
            {
              title: newTask.name,

              dueDate:
                newTask.dueDate ||
                null,

              type:
                newTask.type ||
                "Development",

              columnId:
                firstColumn.id,

              createdBy:
                CURRENT_USER_ID,
            }
          );

        setTasks(
          (prevTasks) => [
            ...prevTasks,
            task,
          ]
        );

        setIsCreateTaskModalOpen(
          false
        );
      } catch (error) {
        console.error(
          "Failed to create task:",
          error
        );

        setError(
          error.message ||
            "Failed to create task"
        );
      }
    };

  /*
   * Create column
   */
  const handleCreateColumn =
    async (columnName) => {
      if (!boardId) {
        setError(
          "Board ID is missing"
        );
        return;
      }

      try {
        const newColumn =
          await createColumn(
            boardId,
            {
              title: columnName,
            }
          );

        setColumns(
          (prevColumns) => [
            ...prevColumns,
            newColumn,
          ]
        );

        setIsCreateColumnModalOpen(
          false
        );
      } catch (error) {
        console.error(
          "Failed to create column:",
          error
        );

        setError(
          error.message ||
            "Failed to create column"
        );
      }
    };

  /*
   * Open edit-column modal
   */
  const handleEditColumn =
    (column) => {
      setSelectedColumn(column);
      setIsEditColumnModalOpen(
        true
      );
    };

  /*
   * Update column
   */
  const handleUpdateColumn =
    async (newName) => {
      if (!selectedColumn) {
        return;
      }

      try {
        const updatedColumn =
          await updateColumn(
            selectedColumn.id,
            {
              title: newName,
            }
          );

        setColumns(
          (prevColumns) =>
            prevColumns.map(
              (column) =>
                column.id ===
                updatedColumn.id
                  ? updatedColumn
                  : column
            )
        );

        setIsEditColumnModalOpen(
          false
        );

        setSelectedColumn(null);
      } catch (error) {
        console.error(
          "Failed to update column:",
          error
        );

        setError(
          error.message ||
            "Failed to update column"
        );
      }
    };

  /*
   * Open delete-column confirmation
   */
  const handleDeleteColumn =
    (column) => {
      setColumnToDelete(column);
    };

  /*
   * Delete column
   */
  const confirmDeleteColumn =
    async () => {
      if (!columnToDelete) {
        return;
      }

      /*
       * Don't even send the request if
       * the column still contains tasks.
       */
      if (
        columnToDelete.count > 0
      ) {
        return;
      }

      try {
        await deleteColumn(
          columnToDelete.id
        );

        setColumns(
          (prevColumns) =>
            prevColumns.filter(
              (column) =>
                column.id !==
                columnToDelete.id
            )
        );

        setColumnToDelete(null);
      } catch (error) {
        console.error(
          "Failed to delete column:",
          error
        );

        setError(
          error.message ||
            "Failed to delete column"
        );
      }
    };

  const cancelDeleteColumn =
    () => {
      setColumnToDelete(null);
    };

  /*
   * Move task between columns
   */
  const handleTaskDrop =
    async (
      taskId,
      targetColumnId
    ) => {
      try {
        const updatedTask =
          await moveTask(
            taskId,
            targetColumnId
          );

        setTasks(
          (prevTasks) =>
            prevTasks.map(
              (task) =>
                task.id ===
                updatedTask.id
                  ? updatedTask
                  : task
            )
        );
      } catch (error) {
        console.error(
          "Failed to move task:",
          error
        );

        setError(
          error.message ||
            "Failed to move task"
        );
      }
    };

  /*
   * Reorder columns.
   *
   * This also saves the new position
   * to MongoDB.
   */
  const handleColumnDrop =
    async (
      draggedColumnId,
      targetColumnId
    ) => {
      if (
        draggedColumnId ===
        targetColumnId
      ) {
        return;
      }

      const fromIndex =
        columns.findIndex(
          (column) =>
            column.id ===
            draggedColumnId
        );

      const toIndex =
        columns.findIndex(
          (column) =>
            column.id ===
            targetColumnId
        );

      if (
        fromIndex === -1 ||
        toIndex === -1
      ) {
        return;
      }

      const reorderedColumns = [
        ...columns,
      ];

      const [
        movedColumn,
      ] =
        reorderedColumns.splice(
          fromIndex,
          1
        );

      reorderedColumns.splice(
        toIndex,
        0,
        movedColumn
      );

      const positionedColumns =
        reorderedColumns.map(
          (column, index) => ({
            ...column,
            position: index,
          })
        );

      /*
       * Update UI immediately.
       */
      setColumns(
        positionedColumns
      );

      /*
       * Save positions to database.
       */
      try {
        await Promise.all(
          positionedColumns.map(
            (column, index) =>
              updateColumn(
                column.id,
                {
                  position: index,
                }
              )
          )
        );
      } catch (error) {
        console.error(
          "Failed to save column order:",
          error
        );

        setError(
          "Column order could not be saved"
        );
      }
    };

  /*
   * Open delete-task confirmation
   */
  const handleDeleteTask =
    (task) => {
      setTaskToDelete(task);
    };

  /*
   * Delete task
   */
  const confirmDeleteTask =
    async () => {
      if (!taskToDelete) {
        return;
      }

      try {
        await deleteTask(
          taskToDelete.id
        );

        setTasks(
          (prevTasks) =>
            prevTasks.filter(
              (task) =>
                task.id !==
                taskToDelete.id
            )
        );

        setTaskToDelete(null);
      } catch (error) {
        console.error(
          "Failed to delete task:",
          error
        );

        setError(
          error.message ||
            "Failed to delete task"
        );
      }
    };

  const cancelDeleteTask =
    () => {
      setTaskToDelete(null);
    };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="kanban-page">
        <main className="kanban-main">
          <p>
            Loading board...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="kanban-page">
      <main className="kanban-main">

        {/* Header */}
        <header className="board-header">

          <h1>
            {board?.name ||
              "Task Board"}
          </h1>

          <div className="board-header-actions">

            <div className="search-box">
              <Search size={14} />

              <input
                type="text"
                placeholder="Search tasks..."
                value={searchText}
                onChange={(e) =>
                  setSearchText(
                    e.target.value
                  )
                }
              />
            </div>

            <button
              className="header-button"
              onClick={() =>
                setIsCreateColumnModalOpen(
                  true
                )
              }
            >
              <Plus size={18} />
              <span>
                New Column
              </span>
            </button>

            <button
              className="header-button"
              onClick={() =>
                setIsCreateTaskModalOpen(
                  true
                )
              }
            >
              <Plus size={18} />
              <span>
                New Task
              </span>
            </button>

            <div
              className="header-more-wrapper"
              ref={menuRef}
            >
              <button
                className="header-more-btn"
                onClick={() =>
                  setIsMenuOpen(
                    (prev) =>
                      !prev
                  )
                }
                aria-label="More options"
              >
                <MoreVertical
                  size={20}
                />
              </button>

              {isMenuOpen && (
                <ul
                  className="header-more-menu"
                  role="menu"
                >
                  <li
                    className="header-more-menu-item"
                    role="menuitem"
                    onClick={() =>
                      setIsMenuOpen(
                        false
                      )
                    }
                  >
                    <ClipboardList
                      size={16}
                    />
                    Activity Log
                  </li>
                </ul>
              )}
            </div>

          </div>
        </header>

        {/* Board summary */}
        <section className="board-summary">

          <div className="board-name">

            <div className="board-document-icon">
              <FileText
                size={31}
                strokeWidth={2}
              />
            </div>

            <h2>
              {board?.name ||
                "Task Board"}
            </h2>

          </div>

          <div className="stat-card">
            <span>
              Total tasks
            </span>

            <strong>
              {boardStats.totalTasks}
            </strong>
          </div>

          <div className="stat-card">
            <span>
              In progress
            </span>

            <strong>
              {boardStats.inProgress}
            </strong>
          </div>

          <div className="stat-card">
            <span>
              Completed
            </span>

            <strong>
              {boardStats.completed}
            </strong>
          </div>

          <div className="stat-card overdue">
            <span>
              Overdue
            </span>

            <strong>
              {boardStats.overdue}
            </strong>
          </div>

        </section>

        {/* Error */}
        {error && (
          <div className="kanban-error">
            {error}
          </div>
        )}

        {/* Kanban board */}
        <section className="kanban-board">

          {columnsWithCounts.map(
            (column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={filteredTasks.filter(
                  (task) =>
                    task.columnId ===
                    column.id
                )}
                onEditColumn={
                  handleEditColumn
                }
                onDeleteColumn={
                  handleDeleteColumn
                }
                onTaskDrop={
                  handleTaskDrop
                }
                onDeleteTask={
                  handleDeleteTask
                }
                onColumnDrop={
                  handleColumnDrop
                }
              />
            )
          )}

        </section>

      </main>

      {/* Create Task */}
      <CreateTaskModal
        isOpen={
          isCreateTaskModalOpen
        }
        onClose={() =>
          setIsCreateTaskModalOpen(
            false
          )
        }
        onSave={
          handleCreateTask
        }
      />

      {/* Create Column */}
      <CreateColumnModal
        isOpen={
          isCreateColumnModalOpen
        }
        onClose={() =>
          setIsCreateColumnModalOpen(
            false
          )
        }
        onCreate={
          handleCreateColumn
        }
      />

      {/* Edit Column */}
      {selectedColumn && (
        <EditColumnModal
          isOpen={
            isEditColumnModalOpen
          }
          initialName={
            selectedColumn.title
          }
          onClose={() => {
            setIsEditColumnModalOpen(
              false
            );

            setSelectedColumn(
              null
            );
          }}
          onSave={
            handleUpdateColumn
          }
        />
      )}

      {/* Delete Column */}
      <ConfirmDialog
        isOpen={
          !!columnToDelete
        }
        title="Delete column?"
        message={
          columnToDelete
            ? columnToDelete.count >
              0
              ? `"${columnToDelete.title}" still has ${columnToDelete.count} task${
                  columnToDelete.count ===
                  1
                    ? ""
                    : "s"
                }. Remove or move all tasks out of this column before deleting it.`
              : `Are you sure you want to delete "${columnToDelete.title}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        confirmDisabled={
          !!columnToDelete &&
          columnToDelete.count > 0
        }
        onConfirm={
          confirmDeleteColumn
        }
        onCancel={
          cancelDeleteColumn
        }
      />

      {/* Delete Task */}
      <ConfirmDialog
        isOpen={
          !!taskToDelete
        }
        title="Delete task?"
        message={
          taskToDelete
            ? `Are you sure you want to delete "${taskToDelete.title}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={
          confirmDeleteTask
        }
        onCancel={
          cancelDeleteTask
        }
      />

    </div>
  );
};

export default KanbanBoard;

