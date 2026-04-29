import React from 'react';
import { LANGUAGE_OPTIONS } from '../data/electionData.js';

function Topbar({ language, setLanguage, user, login, logout }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-icon" aria-hidden="true">
          <svg viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5L11 4.5V9.5L7 12.5L3 9.5V4.5L7 1.5Z" stroke="#7EA8E8" strokeWidth="1" fill="none" />
            <circle cx="7" cy="7" r="2" fill="#7EA8E8" />
          </svg>
        </div>
        <span className="brand-name">ElectionIQ</span>
        <span className="brand-sub">Modern Democracy</span>
      </div>

      <div className="topbar-right">
        <select
          id="langSel"
          className="lang-sel"
          aria-label="Select Language"
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {user ? (
          <div className="user-profile">
            {user.photoURL && <img src={user.photoURL} alt={user.displayName} className="user-avatar" />}
            <span className="user-name">{user.displayName || 'User'}</span>
            <button type="button" className="auth-btn logout" onClick={() => logout()}>Logout</button>
          </div>
        ) : (
          <button type="button" className="auth-btn login" onClick={() => login()}>Login</button>
        )}
      </div>
    </header>
  );
}


export default Topbar;
