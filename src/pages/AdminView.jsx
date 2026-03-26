import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import GalleryGrid from '../components/GalleryGrid';
import AddCardModal from '../components/AddCardModal';

export default function AdminView({ theme, setTheme, settings }) {
  const { currentUser, login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [groupFilter, setGroupFilter] = useState('All');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  if (!currentUser) {
    return (
      <div className="modal-overlay">
        <div className="modal-content glass-panel" style={{ maxWidth: '400px' }}>
          <h2>Admin Gateway</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Please authenticate to access the site controls.</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field" />
            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem' }}>Login to Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Show admin controls perfectly without showcase hiding them */}
      <Navbar theme={theme} toggleTheme={setTheme} isForcedTheme={settings.forceTheme !== 'user'} showAdminControls={true} setShowAddModal={setShowAddModal} />
      
      <main>
        <div style={{ marginBottom: '1rem', padding: '0.8rem 1.5rem', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '8px', color: 'var(--text-main)', fontWeight: 'bold' }}>
          🔒 You are viewing the dedicated Admin Portal. Showcase rules and hidden buttons are bypassed here.
        </div>
        <GalleryGrid 
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          groupFilter={groupFilter}
          setSearchQuery={setSearchQuery}
          setStatusFilter={setStatusFilter}
          setGroupFilter={setGroupFilter}
          globalSettings={settings}
          isAdminView={true}
        />
      </main>

      {showAddModal && <AddCardModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
