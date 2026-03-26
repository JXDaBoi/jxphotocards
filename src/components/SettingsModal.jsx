import { useState, useEffect } from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';

export default function SettingsModal({ onClose }) {
  const { settings, updateSettings } = useSiteSettings();
  
  const [showcaseMode, setShowcaseMode] = useState(settings.showcaseMode);
  const [dashboardEnabled, setDashboardEnabled] = useState(settings.dashboardEnabled);
  const [forceTheme, setForceTheme] = useState(settings.forceTheme);
  const [valueTrackerEnabled, setValueTrackerEnabled] = useState(settings.valueTrackerEnabled);
  const [tradeGeneratorEnabled, setTradeGeneratorEnabled] = useState(settings.tradeGeneratorEnabled);
  const [saving, setSaving] = useState(false);

  // Sync to remote changes just in case
  useEffect(() => {
    setShowcaseMode(settings.showcaseMode);
    setDashboardEnabled(settings.dashboardEnabled);
    setForceTheme(settings.forceTheme);
    setValueTrackerEnabled(settings.valueTrackerEnabled);
    setTradeGeneratorEnabled(settings.tradeGeneratorEnabled);
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        showcaseMode,
        dashboardEnabled,
        forceTheme,
        valueTrackerEnabled,
        tradeGeneratorEnabled
      });
      onClose();
    } catch (err) {
      alert("Failed to save settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '450px' }}>
        <h2>⚙️ Global Site Settings</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          These settings immediately sync and reflect for every public visitor landing on your database.
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
