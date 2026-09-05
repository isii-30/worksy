// src/pages/profile/EditProfile.jsx
import { useEffect, useState } from 'react';
import { UserRound, Camera, Lock, Eye, EyeOff } from 'lucide-react';
import DatePicker from '../../components/common/DatePicker';
import ProfilePictureModal from '../../components/profile/ProfilePictureModal';
import { useProfile } from '../../context/ProfileContext';
import { getEmailFormatError, getEmailDomainSuggestion } from '../../utils/emailValidation';
import * as authService from '../../services/authService';
import './EditProfile.css';

const BIO_MAX_LENGTH = 300;

const NAME_REGEX = /^[A-Za-z\s'-]+$/;
const validators = {
  firstName: (v) => {
    const t = v.trim();
    if (!t) return 'First name is required.';
    if (t.length < 2) return 'First name is too short.';
    if (!NAME_REGEX.test(t)) return 'First name can only contain letters.';
    return '';
  },
  lastName: (v) => {
    const t = v.trim();
    if (!t) return 'Last name is required.';
    if (t.length < 2) return 'Last name is too short.';
    if (!NAME_REGEX.test(t)) return 'Last name can only contain letters.';
    return '';
  },
  email: (v) => {
    const t = v.trim();
    if (!t) return 'Email is required.';
    const err = getEmailFormatError(t);
    return err || '';
  },
  dob: (v) => (v ? '' : 'Date of birth is required.'),

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
  firstName: (v) => v.replace(/[^A-Za-z\s'-]/g, ''),
  lastName: (v) => v.replace(/[^A-Za-z\s'-]/g, ''),
  contactNumber: (v) => v.replace(/[^0-9+\-\s()]/g, ''),
  jobTitle: (v) => v.replace(/[0-9]/g, ''),
};

export default function EditProfile() {
  const { profile, updateProfile, isLoading, loadError } = useProfile();

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isPictureModalOpen, setIsPictureModalOpen] = useState(false);
  const [emailSuggestion, setEmailSuggestion] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  useEffect(() => {
    if (!isLoading && form === null) {
      setForm({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        dob: profile.dob,
        contactNumber: profile.contactNumber,
        jobTitle: profile.jobTitle,
        bio: profile.bio,
      });
    }
  }, [isLoading, profile, form]);

  const validateField = (field, value) => validators[field](value);

  const handleChange = (field) => (e) => {
    setSaveSuccess('');
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaveSuccess('');

    const nextErrors = {};
    Object.keys(form).forEach((field) => {
      nextErrors[field] = validateField(field, form[field]);
    });
    setErrors(nextErrors);
    setTouched(Object.keys(form).reduce((acc, f) => ({ ...acc, [f]: true }), {}));

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) return;

    setIsSaving(true);
    try {
      await updateProfile(form);
      setSaveSuccess('All changes saved.');
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || form === null) {
    return (
      <div className="edit-profile">
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="edit-profile">
        <p className="edit-profile__load-error">
          Couldn't load your profile: {loadError}. Please log in again.
        </p>
      </div>
    );
  }

  return (
    <div className="edit-profile">
      <form onSubmit={handleSave} noValidate>
        <header className="edit-profile__header">
          <h1>My Profile</h1>
          <p>Edit your personal information</p>
        </header>

        <div className="edit-profile__card">
          {saveError && <p className="edit-profile__save-error">{saveError}</p>}
          {saveSuccess && <p className="edit-profile__save-success">{saveSuccess}</p>}

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

              <Field label="Email Address" full>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  readOnly
                  title="Email can't be changed from here."
                />
                <span className="field__hint">Email address can't be changed here.</span>
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
          <button type="submit" className="btn btn--primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>

      <ChangePasswordSection />

      {isPictureModalOpen && (
        <ProfilePictureModal
          currentImage={profile.profileImage}
          onClose={() => setIsPictureModalOpen(false)}
          onSave={async (file, previewUrl) => {
            await updateProfile({ profileImage: previewUrl });
          }}
          onRemove={async () => {
            await updateProfile({ profileImage: null });
          }}
        />
      )}
    </div>
  );
}

function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateNewPassword = (v) => {
    if (!v) return 'New password is required.';
    if (v.length < 8) return 'Password must be at least 8 characters.';
    if (!/[a-z]/.test(v)) return 'Add at least one lowercase letter.';
    if (!/[A-Z]/.test(v)) return 'Add at least one uppercase letter.';
    if (!/\d/.test(v)) return 'Add at least one number.';
    if (!/[^A-Za-z0-9]/.test(v)) return 'Add at least one special character.';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Enter your current password.');
      return;
    }
    const strengthError = validateNewPassword(newPassword);
    if (strengthError) {
      setError(strengthError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      setSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-profile__card edit-profile__password-card">
      <h2 className="edit-profile__password-title">Change Password</h2>
      <p className="edit-profile__password-subtitle">
        Update your password. You'll need to know your current one.
      </p>

      <form onSubmit={handleSubmit} noValidate className="edit-profile__password-form">
        {error && <p className="edit-profile__save-error">{error}</p>}
        {success && <p className="edit-profile__password-success">{success}</p>}

        <label className="field">
          <span className="field__label">
            <Lock size={15} /> Current Password
          </span>
          <div className="edit-profile__password-wrap">
            <input
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="edit-profile__password-eye"
              onClick={() => setShowCurrent((v) => !v)}
              aria-label={showCurrent ? 'Hide password' : 'Show password'}
            >
              {showCurrent ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        </label>

        <label className="field">
          <span className="field__label">
            <Lock size={15} /> New Password
          </span>
          <div className="edit-profile__password-wrap">
            <input
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="edit-profile__password-eye"
              onClick={() => setShowNew((v) => !v)}
              aria-label={showNew ? 'Hide password' : 'Show password'}
            >
              {showNew ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        </label>

        <label className="field">
          <span className="field__label">
            <Lock size={15} /> Confirm New Password
          </span>
          <input
            type={showNew ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            autoComplete="new-password"
          />
        </label>

        <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
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