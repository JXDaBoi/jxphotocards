import { usePhotocards } from '../hooks/usePhotocards';
import { useAuth } from '../hooks/useAuth';
import PhotocardItem from './PhotocardItem';
import EditCardModal from './EditCardModal';
import FilterBar from './FilterBar';
import Dashboard from './Dashboard';
import { useState, useMemo } from 'react';

export default function GalleryGrid({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, groupFilter, setGroupFilter, showcaseMode, setShowcaseMode }) {
  const { photocards, loading, deletePhotocard } = usePhotocards();
  const { currentUser } = useAuth();
  const [editingCard, setEditingCard] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const uniqueGroups = useMemo(() => {
    const groups = new Set(photocards.map(c => c.group).filter(Boolean));
    return Array.from(groups).sort();
  }, [photocards]);

  if (loading) return <div className="loader">Loading your collection...</div>;

  const filtered = photocards.filter(card => {
    const matchSearch = (card.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (card.member || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'All' || (card.status || 'Owned') === statusFilter;
    const matchGroup = groupFilter === 'All' || card.group === groupFilter;
    
    return matchSearch && matchStatus && matchGroup;
  });

  return (
    <>
      {!showcaseMode && <Dashboard photocards={photocards} />}
      
      {!showcaseMode && (
        <div className="filter-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
            <button className="btn-secondary" onClick={() => setFiltersOpen(!filtersOpen)}>
              {filtersOpen ? 'Hide Filters ➖' : '🔍 Expand Search & Filters'}
            </button>
            <button className="btn-secondary" onClick={() => setShowcaseMode(true)} style={{ background: 'var(--accent)', color: 'white', border: 'none' }}>
              📸 Enter Showcase Mode
            </button>
          </div>

          {filtersOpen && (
            <FilterBar 
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              statusFilter={statusFilter} setStatusFilter={setStatusFilter}
              groupFilter={groupFilter} setGroupFilter={setGroupFilter}
              uniqueGroups={uniqueGroups}
            />
          )}
        </div>
      )}

      {showcaseMode && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button className="btn-secondary" onClick={() => setShowcaseMode(false)} style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
            🔙 Exit Showcase Mode
          </button>
        </div>
      )}
      
      {filtered.length === 0 ? (
        <div className="empty-state">No photocards found matching your filters.</div>
      ) : (
        <div className="gallery-grid">
          {filtered.map(card => (
            <PhotocardItem 
              key={card.id} 
              card={card} 
              onDelete={currentUser ? () => deletePhotocard(card.id) : null} 
              onEdit={currentUser ? () => setEditingCard(card) : null}
            />
          ))}
        </div>
      )}

      {editingCard && <EditCardModal card={editingCard} onClose={() => setEditingCard(null)} />}
    </>
  );
}
