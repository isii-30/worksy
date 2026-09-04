import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BoardCard from "../../components/board/BoardCard";
import BoardMembers from "../../components/board/BoardMembers";
import AddBoardMemberModal from "../../components/board/AddBoardMemberModal";
import RemoveBoardMemberModal from "../../components/board/RemoveBoardMemberModal";
import CreateBoardModal from "../../components/board/CreateBoardModal";
import EditBoardModal from "../../components/board/EditBoardModal";
import DeleteBoardModal from "../../components/board/DeleteBoardModal";
import { boardService } from "../../services/boardService";
import styles from "./BoardList.module.css";

const CURRENT_USER_ID = "64f000000000000000000099";
const CARD_COLORS = ["#2f3c88", "#7c9cf0", "#4b5563", "#0f766e", "#9333ea"];
function getCardColor(boardId) {
  const index = boardId.charCodeAt(boardId.length - 1) % CARD_COLORS.length;
  return CARD_COLORS[index];
}

export default function BoardList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workspaceFilter = searchParams.get("workspace") || "all";

  const [boards, setBoards] = useState([]);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [deletingBoard, setDeletingBoard] = useState(null);
  const [viewingMembersBoard, setViewingMembersBoard] = useState(null);
  const [addingMemberBoard, setAddingMemberBoard] = useState(null);
  const [removingMember, setRemovingMember] = useState(null);

  const loadBoards = () => {
    boardService.getBoards(workspaceFilter).then(setBoards);
  };

  useEffect(() => { loadBoards(); }, [workspaceFilter]);

  const filtered = boards.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (data) => {
    await boardService.createBoard({ ...data, currentUserId: CURRENT_USER_ID });
    loadBoards();
  };

  const handleSaveEdit = async (id, data) => {
    await boardService.updateBoard(id, data);
    loadBoards();
  };

  const handleDelete = async (id) => {
    await boardService.deleteBoard(id);
    loadBoards();
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Boards</h1>
          <p className={styles.subtitle}>{boards.length} Boards across your workspaces</p>
        </div>
        <button className={styles.newBoardBtn} onClick={() => setCreateOpen(true)}>
          + New board
        </button>
      </div>

      <div className={styles.searchRow}>
        <input
          className={styles.searchInput}
          placeholder="Search board"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.workspaceSelect}
          value={workspaceFilter}
          onChange={(e) => navigate(`/boards?workspace=${e.target.value}`)}
        >
          <option value="all">All workspaces</option>
          <option value="w1">Product Team</option>
          <option value="w2">Marketing Team</option>
        </select>
      </div>

      <div className={styles.grid}>
        {filtered.map((board) => (
          <BoardCard
            key={board.id}
            board={board}
            currentUserId={CURRENT_USER_ID}
            headerColor={getCardColor(board.id)}
            onEdit={setEditingBoard}
            onDelete={setDeletingBoard}
            onViewMembers={setViewingMembersBoard}
            onClick={(b) => navigate(`/boards/${b.id}`)}
          />
        ))}
        <div className={styles.createCard} onClick={() => setCreateOpen(true)}>
          <span className={styles.plus}>+</span>
          <span>Create Board</span>
        </div>
      </div>

      <CreateBoardModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
       workspaceId="64f000000000000000000001"
        workspaceName={workspaceFilter === "w2" ? "Marketing Team" : "Product Team"}
      />

      <EditBoardModal
        isOpen={!!editingBoard}
        board={editingBoard}
        onClose={() => setEditingBoard(null)}
        onSave={handleSaveEdit}
        onRequestDelete={(board) => {
          setEditingBoard(null);
          setDeletingBoard(board);
        }}
      />

      <DeleteBoardModal
        isOpen={!!deletingBoard}
        board={deletingBoard}
        onClose={() => setDeletingBoard(null)}
        onConfirm={handleDelete}
      />

      <BoardMembers
        isOpen={!!viewingMembersBoard}
        board={viewingMembersBoard}
        isAdmin={viewingMembersBoard?.adminId === CURRENT_USER_ID}
        onClose={() => setViewingMembersBoard(null)}
        onOpenAdd={setAddingMemberBoard}
        onOpenRemove={(board, member) => setRemovingMember({ board, member })}
      />

      <AddBoardMemberModal
        isOpen={!!addingMemberBoard}
        board={addingMemberBoard}
        onClose={() => setAddingMemberBoard(null)}
        onAdded={() => {}}
      />

      <RemoveBoardMemberModal
        isOpen={!!removingMember}
        board={removingMember?.board}
        member={removingMember?.member}
        onClose={() => setRemovingMember(null)}
        onConfirm={(boardId, memberId) => boardService.removeBoardMember(boardId, memberId)}
      />
    </div>
  );
}