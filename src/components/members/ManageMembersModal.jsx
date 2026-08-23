import React, { useState } from "react";
import "./ManageMembersModal.css";

import MemberRow from "./MemberRow";
import RemoveMemberModal from "./RemoveMemberModal";
import InviteMemberModal from "./InviteMemberModal";

import membersImage from "../../assets/manage-members.png";

import {
  getMembers,
  getWorkspaceBoards,
} from "../../services/memberService";


function ManageMembersModal({ onClose }) {
  /* =========================================
     MOCK DATA
  ========================================= */

  const [members, setMembers] = useState(getMembers());

  const workspaceBoards = getWorkspaceBoards();


  /* =========================================
     STATE
  ========================================= */

  const [searchTerm, setSearchTerm] = useState("");

  const [memberToDelete, setMemberToDelete] = useState(null);

  // Controls Invite Member popup
  const [showInviteModal, setShowInviteModal] = useState(false);


  /* =========================================
     ROLE CHANGE
  ========================================= */

  const handleRoleChange = (memberId, newRole) => {
    setMembers((currentMembers) =>
      currentMembers.map((member) =>
        member.id === memberId
          ? { ...member, role: newRole }
          : member
      )
    );
  };


  /* =========================================
     BOARD CHANGE
  ========================================= */

  const handleBoardChange = (memberId, newBoard) => {
    setMembers((currentMembers) =>
      currentMembers.map((member) =>
        member.id === memberId
          ? { ...member, board: newBoard }
          : member
      )
    );
  };


  /* =========================================
     DELETE
  ========================================= */

  const handleDeleteClick = (member) => {
    setMemberToDelete(member);
  };


  const handleConfirmDelete = () => {
    if (!memberToDelete) return;

    setMembers((currentMembers) =>
      currentMembers.filter(
        (member) => member.id !== memberToDelete.id
      )
    );

    setMemberToDelete(null);
  };


  /* =========================================
     SEARCH
  ========================================= */

  const filteredMembers = members.filter((member) =>
    member.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );


  /* =========================================
     SAVE
  ========================================= */

  const handleSaveChanges = () => {
    console.log("Updated members:", members);

    // Later:
    // memberService.updateMembers(members);
  };


  /* =========================================
     INVITE
  ========================================= */

  const handleInvite = (email) => {
    console.log("Invite sent to:", email);

    // Later:
    // memberService.inviteMember(email);

    setShowInviteModal(false);
  };


  return (
    <>
      {/* =====================================
          MANAGE MEMBERS MODAL
      ===================================== */}

      <div className="members-modal-overlay">

        <div className="manage-members-modal">

          {/* Close */}
          <button
            className="members-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>


          {/* =================================
              HEADER
          ================================= */}

          <div className="members-modal-header">

            <div className="members-header-text">

              <h2>
                Manage Members
              </h2>

              <p>
                Manage your team members and their
                <br />
                workspace roles.
              </p>

            </div>


            <img
              src={membersImage}
              alt="Manage members"
              className="members-header-image"
            />

          </div>


          {/* =================================
              SEARCH + NEW MEMBER
          ================================= */}

          <div className="members-actions">

            <div className="members-search">

              <span className="search-icon">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />

            </div>


            <button
              className="new-member-button"
              onClick={() =>
                setShowInviteModal(true)
              }
            >
              <span>
                +
              </span>

              New member
            </button>

          </div>


          {/* =================================
              TABLE HEADINGS
          ================================= */}

          <div className="members-table-header">

            <span>
              Name
            </span>

            <span>
              Role
            </span>

          </div>


          {/* =================================
              MEMBERS
          ================================= */}

          <div className="members-list">

            {filteredMembers.length > 0 ? (

              filteredMembers.map((member) => (

                <MemberRow
                  key={member.id}
                  member={member}
                  boards={workspaceBoards}
                  onRoleChange={handleRoleChange}
                  onBoardChange={handleBoardChange}
                  onDelete={handleDeleteClick}
                />

              ))

            ) : (

              <div className="no-members">
                No members found.
              </div>

            )}

          </div>


          {/* =================================
              FOOTER
          ================================= */}

          <div className="members-modal-footer">

            <button
              className="cancel-button"
              onClick={onClose}
            >
              Cancel
            </button>


            <button
              className="save-members-button"
              onClick={handleSaveChanges}
            >
              ✓&nbsp; Save Changes
            </button>

          </div>

        </div>

      </div>


      {/* =====================================
          DELETE CONFIRMATION
      ===================================== */}

      {memberToDelete && (

        <RemoveMemberModal
          member={memberToDelete}
          onCancel={() =>
            setMemberToDelete(null)
          }
          onConfirm={handleConfirmDelete}
        />

      )}


      {/* =====================================
          INVITE MEMBER MODAL
      ===================================== */}

      {showInviteModal && (

        <InviteMemberModal
          onClose={() =>
            setShowInviteModal(false)
          }
          onInvite={handleInvite}
        />

      )}

    </>
  );
}

export default ManageMembersModal;