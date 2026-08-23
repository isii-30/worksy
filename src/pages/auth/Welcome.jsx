// src/pages/auth/Welcome.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LogIn } from 'lucide-react';
import worksyHero from '../../assets/worksy-hero.png';
import teamIllustration from '../../assets/worksy-team-illustration.png';
import './Welcome.css';

export default function Welcome() {
  const navigate = useNavigate();

  const handleGetStarted = () => navigate('/register');
  const handleLogin = () => navigate('/login');

  return (
    <div className="welcome">
      <div className="welcome__hero">
        <img
          src={worksyHero}
          alt="Worksy — collaborate, organize, and achieve together"
          className="welcome__hero-img"
        />
      </div>

      <div className="welcome__panel">
        <div className="welcome__content">
          <img
            src={teamIllustration}
            alt="Team collaborating around a shared project dashboard"
            className="welcome__illustration"
          />

          <h1>
            Welcome to <span className="welcome__brand">Worksy</span>
          </h1>
          <p className="welcome__subtitle">
            The smart way to collaborate and get things done with your team.
          </p>

          <button type="button" className="welcome__btn welcome__btn--primary" onClick={handleGetStarted}>
            Get Started
            <ArrowRight size={18} />
          </button>
          <p className="welcome__caption">Create your account and start collaborating</p>

          <div className="welcome__divider">
            <span />
            <p>or</p>
            <span />
          </div>

          <button type="button" className="welcome__btn welcome__btn--secondary" onClick={handleLogin}>
            <LogIn size={18} />
            Login to Your Account
          </button>
          <p className="welcome__caption">
            Already have an account?{' '}
            <button type="button" className="welcome__link" onClick={handleLogin}>
              Login Here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}