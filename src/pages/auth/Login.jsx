// src/pages/auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import * as authService from '../../services/authService';
import { useProfile } from '../../context/ProfileContext';
import loginHero from '../../assets/worksy-login.png';
import './Login.css';

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