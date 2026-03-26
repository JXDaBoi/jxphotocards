import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import SettingsModal from './SettingsModal';
import { Link } from 'react-router-dom';

export default function Navbar({ theme, toggleTheme, setShowAddModal, isForcedTheme, showAdminControls }) {
  const { logout } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <nav className="glass-panel navbar">
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <h1 className="logo">✨ Photocard Gallery</h1>
        </Link>
        
        <div className="nav-controls">
          {!isForcedTheme && (
            <div className="theme-toggles">
              <button onClick={() => toggleTheme('light')} className={theme === 'light' ? 'active' : ''}>☀️ Light</button>
              <button onClick={() => toggleTheme('dark')} className={theme === 'dark' ? 'active' : ''}>🌙 Dark</button>
              <button onClick={() => toggleTheme('pastel')} className={theme === 'pastel' ? 'active' : ''}>🌸 Pastel</button>
            </div>
          )}

          <div className="auth-controls" style={{ display: 'flex', gap: '0.8rem' }}>
            {showAdminControls ? (
              <>
                <button className="btn-secondary" onClick={() => setShowSettings(true)}>⚙️ Site Settings</button>
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>+ Add Card</button>
                <button className="btn-secondary" onClick={logout}>Logout</button>
              </>
            ) : (
               <Link to="/admin" className="btn-secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>🛡️ Admin Gateway</Link>
            )}
          </div>
        </div>
      </nav>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}
