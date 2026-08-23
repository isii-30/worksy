import { useState } from "react";
import styles from "./BoardModal.module.css";
import boardIcon from "../../assets/board-icon.jpg";

export default function CreateBoardModal({ isOpen, onClose, onCreate, workspaceId, workspaceName }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!name.trim()) {
      setError("Board name is required.");
      return;
    }
    await onCreate({ name, description, workspaceId, workspaceName });
    setName("");
    setDescription("");
    setError("");
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <img src={boardIcon} alt="" className={styles.illustration} />
        <h2 className={styles.title}>Create Board</h2>
        <p className={styles.subtitle}>Set up a new board for your team</p>

        <label className={styles.label}>Board Name</label>
        <input
          className={styles.input}
          placeholder="e.g. Product Launch"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className={styles.label}>Description</label>
        <textarea
          className={styles.textarea}
          placeholder="What's this board for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.primaryBtn} onClick={handleCreate}>Create</button>
        </div>
      </div>
    </div>
  );
}