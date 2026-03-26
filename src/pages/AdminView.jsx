import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import GalleryGrid from '../components/GalleryGrid';
import AddCardModal from '../components/AddCardModal';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { db } from '../services/firebase';
import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function AdminView() {
  const { currentUser, login } = useAuth();
  const { globalSettings, loading } = useSiteSettings(currentUser?.uid);
  const [theme, setTheme] = useState(() => localStorage.getItem('photocard-theme') || 'light');
  
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

  const handleLegacyMigration = async () => {
    if (!currentUser || !window.confirm("This will link all legacy unassigned cards to your account. Proceed?")) return;
    try {
       const q = query(collection(db, 'photocards'));
       const snap = await getDocs(q);
       const batchUpdates = snap.docs.filter(d => !d.data().ownerUid).map(d => updateDoc(doc(db, 'photocards', d.id), { ownerUid: currentUser.uid }));
       await Promise.all(batchUpdates);
       alert(`Migrated ${batchUpdates.length} legacy cards successfully to your Profile.`);
    } catch (e) {
       alert("Migration failed: " + e.message);
    }
  };

  useEffect(() => {
    if (!globalSettings) return;
    const activeTheme = globalSettings.forceTheme !== 'user' ? globalSettings.forceTheme : theme;
    document.documentElement.setAttribute('data-theme', activeTheme);
    document.body.classList.remove('showcase-active'); // Admin bypass
  }, [theme, globalSettings]);

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
      <Navbar theme={theme} toggleTheme={setTheme} isForcedTheme={globalSettings?.forceTheme !== 'user'} showAdminControls={true} setShowAddModal={setShowAddModal} />
      
      <main>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0.8rem 1.5rem', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.4)', borderRadius: '8px', color: 'var(--text-main)', fontWeight: 'bold' }}>
          <span>🔒 You are viewing the dedicated Admin Portal for UID: {currentUser.uid}</span>
          <button className="action-btn" onClick={handleLegacyMigration} title="Claim Old Unassigned Cards" style={{ fontSize: '1.2rem', padding: '0 0.5rem' }}>♻️ CLAIM LEGACY CARDS</button>
        </div>
        <GalleryGrid 
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          groupFilter={groupFilter}
          setSearchQuery={setSearchQuery}
          setStatusFilter={setStatusFilter}
          setGroupFilter={setGroupFilter}
          globalSettings={globalSettings}
          isAdminView={true}
          adminId={currentUser.uid}
        />
      </main>

      {showAddModal && <AddCardModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
