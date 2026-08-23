import styles from "./ConfirmModal.module.css";

export default function RemoveBoardMemberModal({ isOpen, onClose, board, member, onConfirm }) {
  if (!isOpen || !board || !member) return null;

  const handleConfirm = async () => {
    await onConfirm(board.id, member.id);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Remove {member.name}?</h2>
        <p className={styles.text}>
          They'll lose access to this board, but keep their workspace membership.
        </p>
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.dangerBtn} onClick={handleConfirm}>Remove</button>
        </div>
      </div>
    </div>
  );
}