import { usePhotocards } from '../hooks/usePhotocards';
import { useAuth } from '../hooks/useAuth';
import PhotocardItem from './PhotocardItem';
import EditCardModal from './EditCardModal';
import FilterBar from './FilterBar';
import Dashboard from './Dashboard';
import { useState, useMemo } from 'react';

export default function GalleryGrid({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, groupFilter, setGroupFilter, globalSettings, isAdminView }) {
  const { photocards, loading, deletePhotocard, updatePhotocard } = usePhotocards();
  const { currentUser } = useAuth();
  const [editingCard, setEditingCard] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [gridSize, setGridSize] = useState('medium');

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

  const toggleSelectCard = (id) => {
    const newSet = new Set(selectedCards);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedCards(newSet);
  };

  const handleBatchStatus = async (newStatus) => {
    try {
      if (selectedCards.size === 0) return alert("No cards selected");
      // Fire updates in parallel
      await Promise.all(
        Array.from(selectedCards).map(id => updatePhotocard(id, { status: newStatus }))
      );
      setSelectedCards(newSet => new Set());
      setBatchMode(false);
    } catch (e) {
      alert("Batch edit failed: " + e.message);
    }
  };

  return (
    <div className={!globalSettings.showcaseMode ? 'dashboard-layout' : ''}>
      
      {!globalSettings.showcaseMode && (
        <aside className="sidebar glass-panel" style={{ padding: '0.5rem' }}>
          <FilterBar 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            groupFilter={groupFilter} setGroupFilter={setGroupFilter}
            uniqueGroups={uniqueGroups}
          />
        </aside>
      )}

      <main>
        {globalSettings.showcaseMode && (
         <div className="showcase-hero">
            <h1>JX Photocard Database</h1>
            <p>A beautifully curated, global collection of rarities.</p>
         </div>
        )}

        {!globalSettings.showcaseMode && (
          <div className="admin-toolbar glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span style={{ fontWeight: 600 }}>Grid Size:</span>
              <div className="size-toggles" style={{ marginBottom: 0 }}>
                <button className={`btn-secondary ${gridSize === 'small' ? 'active' : ''}`} onClick={() => setGridSize('small')}>Small</button>
                <button className={`btn-secondary ${gridSize === 'medium' ? 'active' : ''}`} onClick={() => setGridSize('medium')}>Medium</button>
                <button className={`btn-secondary ${gridSize === 'large' ? 'active' : ''}`} onClick={() => setGridSize('large')}>Large</button>
              </div>
            </div>

            {currentUser && isAdminView && (
              <button 
                className={`btn-secondary ${batchMode ? 'active' : ''}`} 
                onClick={() => { setBatchMode(!batchMode); setSelectedCards(new Set()); }}
                style={batchMode ? { background: 'var(--accent)', color: 'white' } : {}}
              >
                {batchMode ? 'Cancel Selection' : '⚡ Batch Edit'}
              </button>
            )}
          </div>
        )}

        {batchMode && selectedCards.size > 0 && (
           <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--accent)', color: 'white' }}>
              <span>⚡ {selectedCards.size} Selected</span>
              <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem' }} onClick={() => handleBatchStatus('Owned')}>Mark Owned</button>
              <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem' }} onClick={() => handleBatchStatus('Wishlist')}>Mark Wishlist</button>
           </div>
        )}
        
        {filtered.length === 0 ? (
          <div className="empty-state">No photocards found matching your filters.</div>
        ) : (
          <div className={`gallery-grid grid-${gridSize}`}>
            {filtered.map(card => {
              const isSelected = selectedCards.has(card.id);
              return (
                <div key={card.id} style={{ position: 'relative' }} onClick={() => batchMode ? toggleSelectCard(card.id) : null}>
                   {batchMode && (
                     <div style={{ position: 'absolute', top: '10px', left: '10px', width: '25px', height: '25px', borderRadius: '50%', background: isSelected ? 'var(--accent)' : 'white', zIndex: 20, border: '2px solid black' }}>
                       {isSelected && <span style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>✓</span>}
                     </div>
                   )}
                  <PhotocardItem 
                    card={card} 
                    onDelete={currentUser && isAdminView && !batchMode ? () => deletePhotocard(card.id) : null} 
                    onEdit={currentUser && isAdminView && !batchMode ? () => setEditingCard(card) : null}
                    globalSettings={globalSettings}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>

      {!globalSettings.showcaseMode && globalSettings.dashboardEnabled && (
        <aside className="sidebar">
          <Dashboard photocards={photocards} globalSettings={globalSettings} />
        </aside>
      )}

      {editingCard && <EditCardModal card={editingCard} onClose={() => setEditingCard(null)} />}
    </div>
  );
}
