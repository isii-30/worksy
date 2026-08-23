import { useState } from "react";
import styles from "./BoardModal.module.css";
import boardIcon from "../../assets/board-icon.jpg";

export default function EditBoardModal({ isOpen, onClose, board, onSave, onRequestDelete }) {
  if (!isOpen || !board) return null;

  return (
    <EditBoardForm
      key={`${board.id}-${isOpen}`}
      board={board}
      onClose={onClose}
      onSave={onSave}
      onRequestDelete={onRequestDelete}
    />
  );
}

function EditBoardForm({ board, onClose, onSave, onRequestDelete }) {
  const [name, setName] = useState(board.name);
  const [description, setDescription] = useState(board.description);

  const handleSave = async () => {
    await onSave(board.id, { name, description });
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
              <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <img src={boardIcon} alt="" className={styles.illustration} />
        <h2 className={styles.title}>Edit Board</h2>
        <p className={styles.subtitle}>Only board admins can make these changes</p>

        <label className={styles.label}>Board Name</label>
        <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} />

        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className={styles.footer}>
          {/* This doesn't delete directly — it opens DeleteBoardModal for confirmation (FR-15) */}
          <button className={styles.dangerBtn} onClick={() => onRequestDelete(board)}>
            Delete Board
          </button>
          <button className={styles.primaryBtn} onClick={handleSave}>Save changes</button>
        </div>
      </div>
    </div>
  );
}