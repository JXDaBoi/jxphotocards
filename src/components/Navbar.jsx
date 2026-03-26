import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

export default function Navbar({ theme, toggleTheme, setShowAddModal }) {
  const { currentUser, logout, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      setShowLogin(false);
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <>
      <nav className="glass-panel navbar">
        <h1 className="logo">✨ Photocard Gallery</h1>
        
        <div className="nav-controls">
          <div className="theme-toggles">
            <button onClick={() => toggleTheme('light')} className={theme === 'light' ? 'active' : ''}>☀️ Light</button>
            <button onClick={() => toggleTheme('dark')} className={theme === 'dark' ? 'active' : ''}>🌙 Dark</button>
            <button onClick={() => toggleTheme('pastel')} className={theme === 'pastel' ? 'active' : ''}>🌸 Pastel</button>
          </div>

          <div className="auth-controls">
            {currentUser ? (
              <>
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>+ Add Card</button>
                <button className="btn-secondary" onClick={logout}>Logout Admin</button>
              </>
            ) : (
              <button className="btn-secondary" onClick={() => setShowLogin(true)}>Admin Login</button>
            )}
          </div>
        </div>
      </nav>

      {showLogin && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel" style={{ maxWidth: '400px' }}>
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <input 
                type="email" 
                placeholder="Admin Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="input-field"
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="input-field"
              />
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowLogin(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Login</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
