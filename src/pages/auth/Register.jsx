// src/pages/auth/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import registerHero from '../../assets/worksy-create-acc.png';
import { getEmailFormatError, getEmailDomainSuggestion } from '../../utils/emailValidation';
import * as authService from '../../services/authService';
import './Register.css';
import { useProfile } from '../../context/ProfileContext';

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
  email: (v) => getEmailFormatError(v),
  password: (v) => {
    if (!v) return 'Password is required.';
    if (v.length < 8) return 'Password must be at least 8 characters.';
    if (!/[a-z]/.test(v)) return 'Add at least one lowercase letter.';
    if (!/[A-Z]/.test(v)) return 'Add at least one uppercase letter.';
    if (!/\d/.test(v)) return 'Add at least one number.';
    if (!/[^A-Za-z0-9]/.test(v)) return 'Add at least one special character.';
    return '';
  },
  confirmPassword: (v, form) => {
    if (!v) return 'Please confirm your password.';
    return v !== form.password ? 'Passwords do not match.' : '';
  },
};

const inputFilters = {
  firstName: (v) => v.replace(/[^A-Za-z\s'-]/g, ''),
  lastName: (v) => v.replace(/[^A-Za-z\s'-]/g, ''),
};

export default function Register() {
  const navigate = useNavigate();
  const { refreshProfile } = useProfile();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [emailSuggestion, setEmailSuggestion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const validateField = (field, value, currentForm) => validators[field](value, currentForm);

  const handleChange = (field) => (e) => {
    const rawValue = e.target.value;
    const value = inputFilters[field] ? inputFilters[field](rawValue) : rawValue;
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);

    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value, nextForm) }));
    }
    if (field === 'password' && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateField('confirmPassword', nextForm.confirmPassword, nextForm),
      }));
    }
    if (field === 'email') {
      setEmailSuggestion(errors.email ? null : getEmailDomainSuggestion(value));
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

  const handleBack = () => navigate('/');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const nextErrors = {};
    Object.keys(form).forEach((field) => {
      nextErrors[field] = validateField(field, form[field], form);
    });
    setErrors(nextErrors);
    setTouched(Object.keys(form).reduce((acc, f) => ({ ...acc, [f]: true }), {}));

    if (Object.values(nextErrors).some(Boolean)) return;

    setIsSubmitting(true);
    try {
      await authService.register(form.firstName, form.lastName, form.email, form.password);
      await refreshProfile();
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heroImage={registerHero}
      heroAlt="Create your Worksy account — collaborate, organize, achieve"
      heroRatio={64}
    >
      <button type="button" className="register__back" onClick={handleBack} aria-label="Go back">
        <ArrowLeft size={20} />
      </button>

      <h1>Create Your Account</h1>
      <p className="register__subtitle">Let's get started with your Worksy account</p>

      <form className="register__form" onSubmit={handleSubmit} noValidate>
        {serverError && <p className="register__server-error">{serverError}</p>}

        <div className="register__row">
          <Field label="First Name" error={touched.firstName && errors.firstName}>
            <input
              value={form.firstName}
              onChange={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              placeholder="First name"
              autoComplete="given-name"
            />
          </Field>

          <Field label="Last Name" error={touched.lastName && errors.lastName}>
            <input
              value={form.lastName}
              onChange={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              placeholder="Last name"
              autoComplete="family-name"
            />
          </Field>
        </div>

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
            <button type="button" className="register__suggestion" onClick={acceptEmailSuggestion}>
              Did you mean <strong>{emailSuggestion}</strong>?
            </button>
          )}
        </Field>

        <Field label="Password" error={touched.password && errors.password}>
          <div className="register__password-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              placeholder="Enter your password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className={`register__eye${showPassword ? ' register__eye--active' : ''}`}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
            </button>
          </div>
        </Field>

        <Field label="Confirm Password" error={touched.confirmPassword && errors.confirmPassword}>
          <div className="register__password-wrap">
            <input
              type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className={`register__eye${showConfirm ? ' register__eye--active' : ''}`}
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <Eye size={17} /> : <EyeOff size={17} />}
            </button>
          </div>
        </Field>

        <button type="submit" className="register__submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Continue'}
          {!isSubmitting && <ArrowRight size={18} />}
        </button>
      </form>
    </AuthLayout>
  );
}

function Field({ label, error, children }) {
  return (
    <label className={`register__field${error ? ' register__field--error' : ''}`}>
      <span className="register__field-label">{label}</span>
      {children}
      {error && <span className="register__field-error">{error}</span>}
    </label>
  );
}