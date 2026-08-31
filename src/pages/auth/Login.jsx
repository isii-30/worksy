// src/pages/auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import * as authService from '../../services/authService';
import { useProfile } from '../../context/ProfileContext';
import loginHero from '../../assets/worksy-login.png';
import './Login.css';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.98v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.98A9 9 0 0 0 0 9c0 1.45.35 2.83.98 4.05l2.99-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .98 4.95l2.99 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}

const validators = {
  email: (v) => {
    if (!v.trim()) return 'Email address is required.';
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
    return valid ? '' : 'Enter a valid email address.';
  },
  password: (v) => (!v ? 'Password is required.' : ''),
};

export default function Login() {
  const navigate = useNavigate();
  const { refreshProfile } = useProfile();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validators[field](value) }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validators[field](form[field]) }));
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleGoogleLogin = () => {
    // TODO: wire to OAuth flow via src/services once backend exists
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {
      email: validators.email(form.email),
      password: validators.password(form.password),
    };
    setErrors(nextErrors);
    setTouched({ email: true, password: true });

    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitError('');
    setIsSubmitting(true);
    try {
      await authService.login(form.email, form.password);
      await refreshProfile();
      navigate('/dashboard');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heroImage={loginHero}
      heroAlt="Welcome back to Worksy — log in and keep collaborating"
      heroRatio={65}
    >
      <p className="login__top-link">
        New here?{' '}
        <button type="button" className="login__link" onClick={handleCreateAccount}>
          Create an account
        </button>
      </p>

      <h1>Login to Your Account</h1>
      <p className="login__subtitle">Welcome back! Please enter your details.</p>

      <form className="login__form" onSubmit={handleSubmit} noValidate>
        {submitError && <p className="login__submit-error">{submitError}</p>}

        <Field label="Email Address" icon={Mail} error={touched.email && errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            onBlur={handleBlur('email')}
            placeholder="Enter your email address"
            autoComplete="email"
          />
        </Field>

        <Field
          label="Password"
          icon={Lock}
          error={touched.password && errors.password}
          hideAutoError
        >
          <div className="login__password-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange('password')}
              onBlur={handleBlur('password')}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              className={`login__eye${showPassword ? ' login__eye--active' : ''}`}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
            </button>
          </div>

          <div className="login__field-footer">
            {touched.password && errors.password ? (
              <span className="login__field-error">{errors.password}</span>
            ) : (
              <span />
            )}
            <button type="button" className="login__forgot" onClick={handleForgotPassword}>
              Forgot password?
            </button>
          </div>
        </Field>

        <button type="submit" className="login__submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in…' : 'Log In'}
          {!isSubmitting && <ArrowRight size={18} />}
        </button>

        <div className="login__divider">
          <span />
          <p>or</p>
          <span />
        </div>

        <button type="button" className="login__google" onClick={handleGoogleLogin}>
          <GoogleIcon />
          Continue with Google
        </button>
      </form>
    </AuthLayout>
  );
}

function Field({ label, icon: Icon, error, hideAutoError, children }) {
  return (
    <label className={`login__field${error ? ' login__field--error' : ''}`}>
      <span className="login__field-label">
        <Icon size={15} /> {label}
      </span>
      {children}
      {!hideAutoError && error && <span className="login__field-error">{error}</span>}
    </label>
  );
}