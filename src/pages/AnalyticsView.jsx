import Dashboard from '../components/Dashboard';
import { useOutletContext } from 'react-router-dom';
import { usePhotocards } from '../hooks/usePhotocards';

export default function AnalyticsView() {
  const { currentUser, globalSettings } = useOutletContext();
  const { photocards, loading } = usePhotocards(currentUser.uid);

  if (loading) return <div className="loader">Loading analytics...</div>;

  return (
    <div className="analytics-view">
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Analytics & Insights</h1>
      <Dashboard photocards={photocards} globalSettings={globalSettings} />
    </div>
  );
}
