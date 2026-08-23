import React, { useState } from "react";
import "./InviteMemberModal.css";

function InviteMemberModal({ onClose, onInvite }) {
  const [email, setEmail] = useState("");

  const handleInvite = () => {
    if (!email.trim()) {
      return;
    }

    if (onInvite) {
      onInvite(email);
    }

    console.log("Invite sent to:", email);
  };

  return (
    <div className="invite-modal-overlay">
      <div className="invite-member-modal">

        {/* Close Button */}
        <button
          className="invite-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {/* Header */}
        <div className="invite-modal-header">

          <div className="invite-header-text">
            <h2>Invite New Member</h2>

            <p>
              Invite new members to your workspace
            </p>
          </div>

          {/* Illustration */}
          <img
            src="/src/assets/manage-members.png"
            alt="Invite member"
            className="invite-header-image"
          />

        </div>


        {/* Search Section */}
        <div className="invite-form">

          <label htmlFor="member-email">
            Search member ...
          </label>

          <div className="invite-search">

            <span className="invite-search-icon">
              ⌕
            </span>

            <input
              id="member-email"
              type="email"
              placeholder="sam@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

          </div>

        </div>


        {/* Invite Button */}
        <button
          className="invite-button"
          onClick={handleInvite}
        >
          <span className="invite-check">✓</span>
          Invite
        </button>

      </div>
    </div>
  );
}

export default InviteMemberModal;