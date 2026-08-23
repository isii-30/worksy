import styles from "./BoardCard.module.css";

export default function BoardCard({ board, onEdit, onDelete, onClick, onViewMembers, currentUserId, headerColor = "#3a4b9e" }) {
  const isAdmin = board.adminId === currentUserId;
  return (
    <div className={styles.card} style={{ position: "relative" }} onClick={() => onClick?.(board)}>
      <div className={styles.header} style={{ background: headerColor }} />
      <div className={styles.body}>
        <div className={styles.topRow}>
          <div>
            <h3 className={styles.name}>{board.name}</h3>
            <p className={styles.workspace}>{board.workspaceName}</p>
          </div>
                    <div className={styles.actions}>
            <button
              className={styles.iconBtnMembers}
              onClick={(e) => { e.stopPropagation(); onViewMembers(board); }}
              aria-label="View board members"
            >
              👥
            </button>
          </div>
          {isAdmin && (
            <div className={styles.actions} style={{ top: 48 }}>
              <button
                className={styles.iconBtn}
                onClick={(e) => { e.stopPropagation(); onEdit(board); }}
                aria-label="Edit board"
              >
                ✏️
              </button>
              <button
                className={styles.iconBtnDanger}
                onClick={(e) => { e.stopPropagation(); onDelete(board); }}
                aria-label="Delete board"
              >
                🗑️
              </button>
            </div>
          )}
        </div>
        <p className={styles.updated}>
          Updated {new Date(board.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}