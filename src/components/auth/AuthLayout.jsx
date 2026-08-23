import './AuthLayout.css';

export default function AuthLayout({ heroImage, heroAlt, heroRatio = 60, children }) {
  const panelRatio = 100 - heroRatio;

  return (
    <div className="auth-layout" style={{ gridTemplateColumns: `${heroRatio}fr ${panelRatio}fr` }}>
      <div className="auth-layout__hero">
        <img src={heroImage} alt={heroAlt} className="auth-layout__hero-img" />
      </div>

      <div className="auth-layout__panel">
        <div className="auth-layout__content">{children}</div>
      </div>
    </div>
  );
}