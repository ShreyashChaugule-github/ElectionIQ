import { useState } from 'react';

const features = [
  {
    icon: '🗳️',
    title: 'Live Dashboard',
    desc: 'Real-time election statistics, party standings, and live vote monitoring bots powered by ECI data.',
    color: '#1b3a6b',
  },
  {
    icon: '🤖',
    title: 'AI Assistant',
    desc: 'Ask any question about Indian elections. Powered by Gemini 3.1 Flash with ECI guidelines built-in.',
    color: '#0d9488',
  },
  {
    icon: '📋',
    title: 'Election Process',
    desc: 'Step-by-step guides for every ECI form — voter registration, corrections, postal ballots, and more.',
    color: '#7c3aed',
  },
  {
    icon: '🧠',
    title: 'Democracy Quiz',
    desc: 'Test your knowledge of the Indian electoral system with an interactive, gamified quiz experience.',
    color: '#ea580c',
  },
];

const stats = [
  { value: '96.8 Cr', label: 'Registered Voters' },
  { value: '10.5 L', label: 'Polling Booths' },
  { value: '543', label: 'Lok Sabha Seats' },
  { value: '100%', label: 'Free to Use' },
];

export default function LandingPage({ onLogin, loading, authError }) {
  const [hovered, setHovered] = useState(null);

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty('--pointer-x', `${x}%`);
    event.currentTarget.style.setProperty('--pointer-y', `${y}%`);
  };

  return (
    <div className="landing" onMouseMove={handlePointerMove}>
      <div className="landing-motion">
        <div className="motion-badge motion-badge-1">🗳️</div>
        <div className="motion-badge motion-badge-2">🇮🇳</div>
        <div className="motion-badge motion-badge-3">📊</div>
        <div className="motion-badge motion-badge-4">👥</div>
        <div className="motion-badge motion-badge-5">🏛️</div>
        <div className="motion-badge motion-badge-6">📋</div>
        <div className="motion-badge motion-badge-7">⚖️</div>
        <div className="motion-badge motion-badge-8">📰</div>
        <div className="motion-badge motion-badge-9">📈</div>
        <div className="motion-badge motion-badge-10">🎯</div>
      </div>
      {/* Background blobs */}
      <div className="landing-blob blob-1" />
      <div className="landing-blob blob-2" />
      <div className="landing-blob blob-3" />

      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-brand">
          <div className="landing-brand-icon">
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M7 1.5L11 4.5V9.5L7 12.5L3 9.5V4.5L7 1.5Z" stroke="#7EA8E8" strokeWidth="1.2" fill="none" />
              <circle cx="7" cy="7" r="2" fill="#7EA8E8" />
            </svg>
          </div>
          <span className="landing-brand-name">ElectionIQ</span>
        </div>
        <button className="landing-nav-login" onClick={onLogin} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </nav>

      {/* Hero */}
      <section className="landing-hero">
        {authError && (
          <div className="landing-auth-error">
            ⚠️ {authError}
          </div>
        )}
        <div className="landing-badge">🇮🇳 Built for Indian Democracy</div>
        <h1 className="landing-title">
          Your Intelligent Guide to<br />
          <span className="landing-title-accent">Indian Elections</span>
        </h1>
        <p className="landing-subtitle">
          Powered by Gemini AI &amp; Election Commission of India guidelines.<br />
          Register, learn, quiz, and never miss your democratic duty.
        </p>

        <div className="landing-cta-group">
          <button
            className="landing-cta-primary"
            onClick={onLogin}
            disabled={loading}
          >
            {loading ? (
              <span className="landing-spinner" />
            ) : (
              <>
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>
          <button
            className="landing-cta-secondary"
            onClick={onLogin}
            disabled={loading}
          >
            Get Started Free →
          </button>
        </div>

        <p className="landing-disclaimer">Free for all citizens. No credit card required.</p>
      </section>

      {/* Stats Strip */}
      <div className="landing-stats">
        {stats.map((s) => (
          <div key={s.label} className="landing-stat">
            <div className="landing-stat-val">{s.value}</div>
            <div className="landing-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section className="landing-features">
        <h2 className="landing-section-title">Everything you need to participate</h2>
        <div className="landing-features-grid">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`landing-feature-card ${hovered === i ? 'hovered' : ''}`}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ '--accent': f.color }}
            >
              <div className="landing-feature-icon">{f.icon}</div>
              <h3 className="landing-feature-title">{f.title}</h3>
              <p className="landing-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="landing-bottom-cta">
        <h2 className="landing-bottom-title">Ready to make your vote count?</h2>
        <p className="landing-bottom-sub">Join millions of informed voters using ElectionIQ.</p>
        <button className="landing-cta-primary large" onClick={onLogin} disabled={loading}>
          {loading ? 'Signing in…' : '🗳️ Get Started Now'}
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <span>© 2024 ElectionIQ — Built on Gemini AI</span>
        <span>Data sourced from ECI (eci.gov.in)</span>
      </footer>
    </div>
  );
}
