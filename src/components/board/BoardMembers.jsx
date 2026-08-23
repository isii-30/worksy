import { useEffect, useState } from "react";
import { boardService } from "../../services/boardService";
import styles from "./BoardMembers.module.css";
import membersIcon from "../../assets/members-icon.jpg";

export default function BoardMembers({ isOpen, onClose, board, onOpenAdd, onOpenRemove, isAdmin }) {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isOpen && board) {
      boardService.getBoardMembers(board.id).then(setMembers);
    }
  }, [isOpen, board]);

  if (!isOpen || !board) return null;

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
               <button className={styles.closeBtn} onClick={onClose}>✕</button>
        <img src={membersIcon} alt="" className={styles.illustration} />
        <h2 className={styles.title}>Board Members</h2>
        <p className={styles.subtitle}>Manage your board members and their roles.</p>

                <div className={styles.searchRow}>
          <input
            className={styles.searchInput}
            placeholder="Search member"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isAdmin && (
            <button className={styles.addBtn} onClick={() => onOpenAdd(board)}>
              + Add member
            </button>
          )}
        </div>
        <div className={styles.list}>
          {filtered.map((m) => (
            <div key={m.id} className={styles.row}>
              <div className={styles.person}>
                <div className={styles.avatar}>{m.name[0]}</div>
                <span>
                  {m.name} {m.role === "Admin" && <span className={styles.adminTag}>Admin</span>}
                </span>
              </div>
                           {/* Only admins can remove members; the sole Admin can never be removed (FR-16) */}
              {isAdmin && (
                <button
                  className={styles.removeBtn}
                  disabled={m.role === "Admin"}
                  onClick={() => onOpenRemove(board, m)}
                  aria-label={`Remove ${m.name}`}
                >
                  🗑️
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}