import SettingsModal from '../components/SettingsModal';
import { useOutletContext } from 'react-router-dom';

export default function SettingsView() {
  const { currentUser } = useOutletContext();

  return (
    <div className="settings-view">
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Global Settings</h1>
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <SettingsModal standalone={true} adminId={currentUser.uid} />
      </div>
    </div>
  );
}
