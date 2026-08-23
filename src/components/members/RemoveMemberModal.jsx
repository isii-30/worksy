import React from "react";
import "./RemoveMemberModal.css";

function RemoveMemberModal({
  member,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="remove-modal-overlay">

      <div className="remove-member-modal">

        <div className="remove-icon">
          !
        </div>

        <h2>Remove Member?</h2>

        <p>
          Are you sure you want to remove{" "}
          <strong>{member.name}</strong> from
          this workspace?
        </p>

        <p className="remove-warning">
          This will revoke their workspace access.
        </p>

        <div className="remove-modal-actions">

          <button
            className="remove-cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="remove-confirm-button"
            onClick={onConfirm}
          >
            Yes, Remove
          </button>

        </div>

      </div>

    </div>
  );
}

export default RemoveMemberModal;