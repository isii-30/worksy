// src/pages/auth/ForgotPassword.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import resetHero from '../../assets/worksy-reset-password.png';
import { getEmailFormatError, getEmailDomainSuggestion } from '../../utils/emailValidation';
import './ForgotPassword.css';
import { resetPassword } from '../../services/authService';
const validators = {
  email: (v) => getEmailFormatError(v),
  newPassword: (v) => {
    if (!v) return 'New password is required.';
    if (v.length < 8) return 'Password must be at least 8 characters.';
    if (!/[a-z]/.test(v)) return 'Add at least one lowercase letter.';
    if (!/[A-Z]/.test(v)) return 'Add at least one uppercase letter.';
    if (!/\d/.test(v)) return 'Add at least one number.';
    if (!/[^A-Za-z0-9]/.test(v)) return 'Add at least one special character.';
    return '';
  },
  confirmPassword: (v, form) => {
    if (!v) return 'Please confirm your new password.';
    return v !== form.newPassword ? 'Passwords do not match.' : '';
  },
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', newPassword: '', confirmPassword: '' });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [emailSuggestion, setEmailSuggestion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateField = (field, value, currentForm) => validators[field](value, currentForm);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);

    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value, nextForm) }));
    }
    if (field === 'newPassword' && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateField('confirmPassword', nextForm.confirmPassword, nextForm),
      }));
    }
    if (field === 'email') {
      const error = validators.email(value);
      setEmailSuggestion(error ? null : getEmailDomainSuggestion(value));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, form[field], form);
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

  const handleBack = () => navigate('/login');

  const handleSubmit = async (e) => {
  e.preventDefault();

  const nextErrors = {
    email: validateField('email', form.email, form),
    newPassword: validateField('newPassword', form.newPassword, form),
    confirmPassword: validateField('confirmPassword', form.confirmPassword, form),
  };
  setErrors(nextErrors);
  setTouched({ email: true, newPassword: true, confirmPassword: true });

  if (Object.values(nextErrors).some(Boolean)) return;

  setSubmitError('');
  setIsSubmitting(true);
  try {
    await resetPassword(form.email, form.newPassword);
    navigate('/login');
  } catch (err) {
    setSubmitError(err.message);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <AuthLayout
      heroImage={resetHero}
      heroAlt="Forgot your password — reset it via email"
      heroRatio={65}
    >
      <button type="button" className="forgot-password__back" onClick={handleBack} aria-label="Go back">
        <ArrowLeft size={20} />
      </button>

      <h1>Reset Your Password</h1>

      <form className="forgot-password__form" onSubmit={handleSubmit} noValidate>
        <Field label="Email Address" error={touched.email && errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            placeholder="Enter your email address"
            autoComplete="email"
          />
          {!errors.email && emailSuggestion && (
            <button type="button" className="forgot-password__suggestion" onClick={acceptEmailSuggestion}>
              Did you mean <strong>{emailSuggestion}</strong>?
            </button>
          )}
        </Field>

        <Field label="New Password" error={touched.newPassword && errors.newPassword}>
          <div className="forgot-password__password-wrap">
            <input
              type={showNew ? 'text' : 'password'}
              value={form.newPassword}
              onChange={handleChange('newPassword')}
              onBlur={handleBlur('newPassword')}
              placeholder="Enter your new password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className={`forgot-password__eye${showNew ? ' forgot-password__eye--active' : ''}`}
              onClick={() => setShowNew((v) => !v)}
              aria-label={showNew ? 'Hide password' : 'Show password'}
            >
              {showNew ? <Eye size={17} /> : <EyeOff size={17} />}
            </button>
          </div>
        </Field>

        <Field label="Confirm Password" error={touched.confirmPassword && errors.confirmPassword}>
          <div className="forgot-password__password-wrap">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              placeholder="Confirm your new password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className={`forgot-password__eye${showConfirm ? ' forgot-password__eye--active' : ''}`}
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <Eye size={17} /> : <EyeOff size={17} />}
            </button>
          </div>
        </Field>

        {submitError && <p className="forgot-password__submit-error">{submitError}</p>}
        <button type="submit" className="forgot-password__submit" disabled={isSubmitting}>
          {isSubmitting ? 'Resetting…' : 'Continue'}
          {!isSubmitting && <ArrowRight size={18} />}
        </button>
      </form>
    </AuthLayout>
  );
}

function Field({ label, error, children }) {
  return (
    <label className={`forgot-password__field${error ? ' forgot-password__field--error' : ''}`}>
      <span className="forgot-password__field-label">{label}</span>
      {children}
      {error && <span className="forgot-password__field-error">{error}</span>}
    </label>
  );
}