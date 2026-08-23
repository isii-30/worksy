import styles from "./ConfirmModal.module.css";

export default function DeleteBoardModal({ isOpen, board, onClose, onConfirm }) {
  if (!isOpen || !board) return null;

  const handleConfirm = async () => {
    await onConfirm(board.id);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Delete "{board.name}"?</h2>
        <p className={styles.text}>
          This can't be undone. Board members will keep their workspace access,
          but they'll lose access to this board and its data.
        </p>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.dangerBtn} onClick={handleConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}