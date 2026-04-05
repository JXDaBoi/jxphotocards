import { useParams } from 'react-router-dom';
import GalleryGrid from './GalleryGrid';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { usePhotocards } from '../hooks/usePhotocards';
import { useState, useMemo } from 'react';
import FilterBar from './FilterBar';
import Navbar from './Navbar';

export default function CollectionLoader() {
  const { adminId } = useParams();
  const { globalSettings, profile, loading: settingsLoading } = useSiteSettings(adminId);
  const { photocards, loading: cardsLoading } = usePhotocards(adminId);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [groupFilter, setGroupFilter] = useState('All');
  const [theme, setTheme] = useState(globalSettings?.theme || 'dark');

  const uniqueGroups = useMemo(() => {
    const groups = new Set(photocards.map(c => c.group).filter(Boolean));
    return Array.from(groups).sort();
  }, [photocards]);

  if (settingsLoading) return <div className="loading-state">Loading Collector...</div>;
  if (!profile) return <div className="empty-state">Collection not found.</div>;

  // Apply theme dynamically for this specific collector
  const activeTheme = globalSettings?.forceTheme !== 'user' ? globalSettings?.forceTheme : theme;
  document.documentElement.setAttribute('data-theme', activeTheme);
  
  if (globalSettings?.showcaseMode) {
    document.body.classList.add('showcase-active');
  } else {
    document.body.classList.remove('showcase-active');
  }

  return (
    <div className="app-container">
      <Navbar theme={theme} toggleTheme={setTheme} isForcedTheme={globalSettings?.forceTheme !== 'user'} showAdminControls={false} />
      
      <div className="collection-header glass-panel" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ margin: 0, color: 'var(--accent)', fontSize: '2.5rem' }}>{profile.displayName}'s Collection</h2>
        {profile.bio && <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)' }}>{profile.bio}</p>}
      </div>

      {!globalSettings?.showcaseMode && (
        <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem' }}>
          <FilterBar 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            groupFilter={groupFilter} setGroupFilter={setGroupFilter}
            uniqueGroups={uniqueGroups}
          />
        </div>
      )}

      <GalleryGrid 
        photocards={photocards}
        loading={cardsLoading}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        groupFilter={groupFilter}
        globalSettings={globalSettings}
        isAdminView={false}
      />
    </div>
  );
}
