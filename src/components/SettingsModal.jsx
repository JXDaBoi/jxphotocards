import { useState, useEffect } from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useAuth } from '../hooks/useAuth';

export default function SettingsModal({ onClose }) {
  const { currentUser } = useAuth();
  const { globalSettings: settings, profile, updateSettings, updateProfile } = useSiteSettings(currentUser?.uid);
  
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [bio, setBio] = useState(profile?.bio || '');

  const [showcaseMode, setShowcaseMode] = useState(settings?.showcaseMode || false);
  const [dashboardEnabled, setDashboardEnabled] = useState(settings?.dashboardEnabled || true);
  const [forceTheme, setForceTheme] = useState(settings?.forceTheme || 'user');
  const [valueTrackerEnabled, setValueTrackerEnabled] = useState(settings?.valueTrackerEnabled || false);
  const [tradeGeneratorEnabled, setTradeGeneratorEnabled] = useState(settings?.tradeGeneratorEnabled || true);
  const [saving, setSaving] = useState(false);

  // Sync to remote changes just in case
  useEffect(() => {
    if (!settings) return;
    setShowcaseMode(settings.showcaseMode);
    setDashboardEnabled(settings.dashboardEnabled);
    setForceTheme(settings.forceTheme);
    setValueTrackerEnabled(settings.valueTrackerEnabled);
    setTradeGeneratorEnabled(settings.tradeGeneratorEnabled);
  }, [settings]);

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.displayName);
    setBio(profile.bio);
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ displayName, bio }, currentUser?.uid);
      await updateSettings({
        showcaseMode,
        dashboardEnabled,
        forceTheme,
        valueTrackerEnabled,
        tradeGeneratorEnabled
      }, currentUser?.uid);
      onClose();
    } catch (err) {
      alert("Failed to save settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '450px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2>⚙️ Collector Profile & Settings</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          These settings actively sync to your specialized Collection Hub URL and control your public portfolio.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
             <h4 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Collection Profile</h4>
             <input type="text" placeholder="Collection Display Name (e.g. Jennie's Hub)" value={displayName} onChange={e => setDisplayName(e.target.value)} className="input-field" style={{ marginBottom: '0.5rem' }} />
             <input type="text" placeholder="Short Bio / Description" value={bio} onChange={e => setBio(e.target.value)} className="input-field" style={{ marginBottom: 0 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ marginBottom: '0.2rem' }}>Public Showcase Mode</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hides all extra UI, keeping only the raw clean grid.</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={showcaseMode} onChange={(e) => setShowcaseMode(e.target.checked)} />
              <span className="slider round"></span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ marginBottom: '0.2rem' }}>Enable Analytics Dashboard</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Show the top row of numerical statistics.</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={dashboardEnabled} onChange={(e) => setDashboardEnabled(e.target.checked)} />
              <span className="slider round"></span>
            </label>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ marginBottom: '0.2rem' }}>Force Public Theme</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Lock all visitors into a specific visual aesthetic.</p>
            </div>
            <select value={forceTheme} onChange={(e) => setForceTheme(e.target.value)} className="input-field" style={{ width: '150px', marginBottom: 0 }}>
              <option value="user">User Choice</option>
              <option value="light">☀️ Light</option>
              <option value="dark">🌙 Dark</option>
              <option value="pastel">🌸 Pastel</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ marginBottom: '0.2rem' }}>Portfolio Value Tracker</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Displays total valuation on the dashboard.</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={valueTrackerEnabled} onChange={(e) => setValueTrackerEnabled(e.target.checked)} />
              <span className="slider round"></span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ marginBottom: '0.2rem' }}>Public Trade Generator</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Visitors can click a button to copy a trade DM template.</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={tradeGeneratorEnabled} onChange={(e) => setTradeGeneratorEnabled(e.target.checked)} />
              <span className="slider round"></span>
            </label>
          </div>

        </div>

        <div className="modal-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
          <button type="button" onClick={onClose} className="btn-secondary" disabled={saving}>Cancel</button>
          <button type="button" onClick={handleSave} className="btn-primary" disabled={saving}>{saving ? 'Syncing...' : 'Save Globally'}</button>
        </div>
      </div>
    </div>
  );
}
