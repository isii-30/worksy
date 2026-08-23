// src/pages/profile/EditProfile.jsx
import { useState } from 'react';
import { UserRound, Camera } from 'lucide-react';
import DatePicker from '../../components/common/DatePicker';
import ProfilePictureModal from '../../components/profile/ProfilePictureModal';
import { useProfile } from '../../context/ProfileContext';
import { getEmailFormatError, getEmailDomainSuggestion } from '../../utils/emailValidation';
import './EditProfile.css';

const BIO_MAX_LENGTH = 300;

const validators = {
  firstName: (v) => {
    if (!v.trim()) return 'First name is required.';
    if (v.trim().length < 2) return 'First name is too short.';
    return '';
  },
  lastName: (v) => (!v.trim() ? 'Last name is required.' : ''),
  email: (v) => getEmailFormatError(v),
  dob: (v) => {
    if (!v) return '';
    return new Date(v) > new Date() ? 'Date of birth cannot be in the future.' : '';
  },
  contactNumber: (v) => {
    if (!v.trim()) return '';
    const valid = /^[0-9+\-\s()]{7,15}$/.test(v.trim());
    return valid ? '' : 'Enter a valid contact number (7–15 digits).';
  },
  jobTitle: (v) => {
    if (!v.trim()) return '';
    return /\d/.test(v) ? 'Job title cannot contain numbers.' : '';
  },
  bio: (v) => (v.length > BIO_MAX_LENGTH ? `Bio must be ${BIO_MAX_LENGTH} characters or fewer.` : ''),
};

const inputFilters = {
  contactNumber: (v) => v.replace(/[^0-9+\-\s()]/g, ''),
  jobTitle: (v) => v.replace(/[0-9]/g, ''),
};

export default function EditProfile() {
  const { profile, updateProfile } = useProfile();

  const [form, setForm] = useState(() => ({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    dob: profile.dob,
    contactNumber: profile.contactNumber,
    jobTitle: profile.jobTitle,
    bio: profile.bio,
  }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
  const [emailSuggestion, setEmailSuggestion] = useState(null);

  const validateField = (field, value) => validators[field](value);

  const handleChange = (field) => (e) => {
    const rawValue = e.target.value;
    const value = inputFilters[field] ? inputFilters[field](rawValue) : rawValue;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
    if (field === 'email') {
      const error = validateField('email', value);
      setEmailSuggestion(error ? null : getEmailDomainSuggestion(value));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
    if (field === 'email') {
      setEmailSuggestion(error ? null : getEmailDomainSuggestion(form.email));
    }
  };

  const acceptEmailSuggestion = () => {
    if (!emailSuggestion) return;
    setForm((prev) => ({ ...prev, email: emailSuggestion }));
    setEmailSuggestion(null);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const nextErrors = {};
    Object.keys(form).forEach((field) => {
      nextErrors[field] = validateField(field, form[field]);
    });
    setErrors(nextErrors);
    setTouched(Object.keys(form).reduce((acc, f) => ({ ...acc, [f]: true }), {}));

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) return;

    updateProfile(form);
    // TODO: also call the backend profile update service (src/services) here
  };

  return (
    <form className="edit-profile" onSubmit={handleSave} noValidate>
      <header className="edit-profile__header">
        <h1>My Profile</h1>
        <p>Edit your personal information</p>
      </header>

      <div className="edit-profile__card">
        <div className="edit-profile__layout">
          <div className="edit-profile__fields">
            <Field label="First Name" error={touched.firstName && errors.firstName}>
              <input
                value={form.firstName}
                onChange={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                placeholder="Enter your first name"
              />
            </Field>

            <Field label="Last Name" error={touched.lastName && errors.lastName}>
              <input
                value={form.lastName}
                onChange={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                placeholder="Enter your last name"
              />
            </Field>

            <Field label="Email Address" full error={touched.email && errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder="Enter your email address"
              />
              {!errors.email && emailSuggestion && (
                <button type="button" className="field__suggestion" onClick={acceptEmailSuggestion}>
                  Did you mean <strong>{emailSuggestion}</strong>?
                </button>
              )}
            </Field>

            <Field label="Date of birth" full error={touched.dob && errors.dob}>
              <DatePicker
                id="dob"
                value={form.dob}
                onChange={(iso) => setForm((prev) => ({ ...prev, dob: iso }))}
                onBlur={handleBlur('dob')}
                maxDate={new Date()}
              />
            </Field>

            <Field label="Contact number" error={touched.contactNumber && errors.contactNumber}>
              <input
                type="tel"
                value={form.contactNumber}
                onChange={handleChange('contactNumber')}
                onBlur={handleBlur('contactNumber')}
                placeholder="Enter your contact number"
              />
            </Field>

            <Field label="Job Title" error={touched.jobTitle && errors.jobTitle}>
              <input
                value={form.jobTitle}
                onChange={handleChange('jobTitle')}
                onBlur={handleBlur('jobTitle')}
                placeholder="Enter your job title"
              />
            </Field>
          </div>

          <div className="edit-profile__side">
            <div className="edit-profile__avatar">
              <div className="edit-profile__avatar-circle">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt="Your profile" className="edit-profile__avatar-img" />
                ) : (
                  <UserRound size={36} />
                )}
              </div>
              <button
                type="button"
                className="edit-profile__avatar-edit"
                aria-label="Change profile picture"
                onClick={() => setIsPictureModalOpen(true)}
              >
                <Camera size={16} />
              </button>
            </div>

            <Field label="Bio" error={touched.bio && errors.bio}>
              <textarea
                className="edit-profile__bio"
                value={form.bio}
                onChange={handleChange('bio')}
                onBlur={handleBlur('bio')}
                placeholder="Tell your team a little about yourself"
                maxLength={BIO_MAX_LENGTH}
                rows={6}
              />
              <span className="field__hint">{form.bio.length}/{BIO_MAX_LENGTH}</span>
            </Field>
          </div>
        </div>
      </div>

      <div className="edit-profile__actions">
        <button type="submit" className="btn btn--primary">Save changes</button>
      </div>

      {isPictureModalOpen && (
        <ProfilePictureModal
          currentImage={profile.profileImage}
          onClose={() => setIsPictureModalOpen(false)}
          onSave={(file, previewUrl) => {
            updateProfile({ profileImage: previewUrl });
            // TODO: upload `file` to the backend via src/services once that endpoint exists
          }}
          onRemove={() => updateProfile({ profileImage: null })}
        />
      )}
    </form>
  );
}

function Field({ label, full, error, children }) {
  return (
    <label className={`field${full ? ' field--full' : ''}${error ? ' field--error' : ''}`}>
      <span className="field__label">{label}</span>
      {children}
      {error && <span className="field__error">{error}</span>}
    </label>
  );
}