import { useParams } from 'react-router-dom';
import GalleryGrid from './GalleryGrid';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useState } from 'react';

export default function CollectionLoader() {
  const { adminId } = useParams();
  const { globalSettings, profile, loading } = useSiteSettings(adminId);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [groupFilter, setGroupFilter] = useState('All');

  if (loading) return <div className="loading-state">Loading Collector...</div>;
  if (!profile) return <div className="empty-state">Collection not found.</div>;

  // Apply theme dynamically for this specific collector
  document.body.className = `${globalSettings?.theme || 'dark'} ${globalSettings?.showcaseMode ? 'showcase-active' : ''}`;

  return (
    <>
      <div className="collection-header glass-panel" style={{ padding: '1rem', textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, color: 'var(--accent)' }}>{profile.displayName}'s Collection</h2>
        {profile.bio && <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>{profile.bio}</p>}
      </div>
      <GalleryGrid 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        groupFilter={groupFilter} setGroupFilter={setGroupFilter}
        globalSettings={globalSettings}
        isAdminView={false}
        adminId={adminId}
      />
    </>
  );
}
