import { UserRound, Mail, Phone, Calendar, Briefcase, X } from 'lucide-react';
import './ViewProfileModal.css';

export default function ViewProfileModal({ user, onClose }) {
  if (!user) return null;

  const rows = [
    { icon: Mail, label: 'Email Address', value: user.email },
    { icon: Phone, label: 'Contact number', value: user.contactNumber },
    { icon: Calendar, label: 'Date of birth', value: user.dob },
    { icon: Briefcase, label: 'Job Title', value: user.jobTitle },
  ];

  return (
    <div className="view-profile-overlay" onClick={onClose}>
      <div className="view-profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="view-profile-modal__close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="view-profile-modal__cover" />

        <div className="view-profile-modal__header">
          <div className="view-profile-modal__avatar">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.fullName} className="view-profile-modal__avatar-img" />
            ) : (
              <UserRound size={40} />
            )}
          </div>
          <h2>{user.fullName}</h2>
          {user.jobTitle && <p className="view-profile-modal__role">{user.jobTitle}</p>}
        </div>

        {user.bio && <p className="view-profile-modal__bio">{user.bio}</p>}

        <div className="view-profile-modal__divider" />

        <dl className="view-profile-modal__rows">
          {rows.map(({ icon: Icon, label, value }) => (
            <div className="view-profile-modal__row" key={label}>
              <dt><Icon size={16} /> {label}</dt>
              <dd>{value || '—'}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}