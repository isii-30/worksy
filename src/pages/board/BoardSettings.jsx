import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import BoardMembers from "../../components/board/BoardMembers";
import AddBoardMemberModal from "../../components/board/AddBoardMemberModal";
import RemoveBoardMemberModal from "../../components/board/RemoveBoardMemberModal";
import EditBoardModal from "../../components/board/EditBoardModal";
import DeleteBoardModal from "../../components/board/DeleteBoardModal";
import { boardService } from "../../services/boardService";

export default function BoardSettings({ boardId, onBack }) {
  const [board, setBoard] = useState(null);
  const [membersOpen, setMembersOpen] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    boardService.getBoardById(boardId).then(setBoard);
  }, [boardId]);

  if (!board) return <Layout><p>Loading board...</p></Layout>;

  return (
    <Layout>
      <button onClick={onBack} style={{ marginBottom: 16 }}>← Back to Boards</button>
      <h1>{board.name}</h1>
      <h1>{board.name}</h1>
      <p>{board.description}</p>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        <button onClick={() => setEditOpen(true)}>Edit Board</button>
        <button onClick={() => setMembersOpen(true)}>View Members</button>
      </div>

      <BoardMembers
        isOpen={membersOpen}
        board={board}
        onClose={() => setMembersOpen(false)}
        onOpenAdd={() => setAddOpen(true)}
        onOpenRemove={(b, member) => setRemoveTarget(member)}
      />

      <AddBoardMemberModal
        isOpen={addOpen}
        board={board}
        onClose={() => setAddOpen(false)}
        onAdded={() => {}}
      />

      <RemoveBoardMemberModal
        isOpen={!!removeTarget}
        board={board}
        member={removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={(boardId, memberId) => boardService.removeBoardMember(boardId, memberId)}
      />


      <EditBoardModal
        isOpen={editOpen}
        board={board}
        onClose={() => setEditOpen(false)}
        onSave={async (id, data) => setBoard(await boardService.updateBoard(id, data))}
        onRequestDelete={() => { setEditOpen(false); setDeleteOpen(true); }}
      />

      <DeleteBoardModal
        isOpen={deleteOpen}
        board={board}
        onClose={() => setDeleteOpen(false)}
        onConfirm={(id) => boardService.deleteBoard(id)}
      />
    </Layout>
  );
}