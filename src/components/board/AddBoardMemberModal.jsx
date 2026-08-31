import { useEffect, useState } from "react";
import { boardService } from "../../services/kboardService";
import styles from "./BoardMembers.module.css";

export default function AddBoardMemberModal({ isOpen, onClose, board, onAdded }) {
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);

  const handleClose = () => {
    setQuery("");
    setSelected(null);
    onClose();
  };

  useEffect(() => {
    if (isOpen && board) {
      boardService.getAddableMembers(board.id, board.workspaceId).then(setCandidates);
    }
  }, [isOpen, board]);

  if (!isOpen || !board) return null;

  const filtered = candidates.filter(
    (c) =>
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      c.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleAdd = async () => {
    if (!selected) return;
    const updated = await boardService.addBoardMember(board.id, selected);
    onAdded(updated);
    handleClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={handleClose}>✕</button>
        <h2 className={styles.title}>Add New Member</h2>
        <p className={styles.subtitle}>Add new members to your board</p>

        <label style={{ fontWeight: 600, color: "#2f3c88" }}>Search member ...</label>
        <input
          className={styles.searchInput}
          style={{ width: "100%", marginTop: 8, marginBottom: 16, boxSizing: "border-box" }}
          placeholder="name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className={styles.list}>
          {filtered.map((c) => (
            <div
              key={c.id}
              className={styles.row}
              style={{
                cursor: "pointer",
                background: selected?.id === c.id ? "#eef2ff" : "transparent",
              }}
              onClick={() => setSelected(c)}
            >
              <div className={styles.person}>
                <div className={styles.avatar}>{c.name[0]}</div>
                <span>{c.name} — {c.email}</span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p style={{ color: "#9ca3af", padding: "20px 0" }}>
              No matching workspace members found.
            </p>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
          <button className={styles.addBtn} disabled={!selected} onClick={handleAdd}>
            ✓ Add
          </button>
        </div>
      </div>
    </div>
  );
}