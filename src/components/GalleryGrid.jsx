import { usePhotocards } from '../hooks/usePhotocards';
import { useAuth } from '../hooks/useAuth';
import PhotocardItem from './PhotocardItem';
import EditCardModal from './EditCardModal';
import FilterBar from './FilterBar';
import Dashboard from './Dashboard';
import { useState, useMemo } from 'react';

export default function GalleryGrid({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, groupFilter, setGroupFilter, globalSettings }) {
  const { photocards, loading, deletePhotocard, updatePhotocard } = usePhotocards();
  const { currentUser } = useAuth();
  const [editingCard, setEditingCard] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState(new Set());

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
    <>
      {globalSettings.dashboardEnabled && !globalSettings.showcaseMode && (
        <Dashboard photocards={photocards} globalSettings={globalSettings} />
      )}
      
      {!globalSettings.showcaseMode && (
        <div className="filter-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <button className="btn-secondary" onClick={() => setFiltersOpen(!filtersOpen)}>
              {filtersOpen ? 'Hide Filters ➖' : '🔍 Expand Search & Filters'}
            </button>
            {currentUser && (
              <button 
                className={`btn-secondary ${batchMode ? 'active' : ''}`} 
                onClick={() => { setBatchMode(!batchMode); setSelectedCards(new Set()); }}
                style={batchMode ? { background: 'var(--accent)', color: 'white' } : {}}
              >
                {batchMode ? 'Cancel Selection' : '⚡ Batch Edit'}
              </button>
            )}
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

      {batchMode && selectedCards.size > 0 && (
         <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--accent)', color: 'white' }}>
            <span>⚡ {selectedCards.size} Selected</span>
            <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem' }} onClick={() => handleBatchStatus('Owned')}>Mark Owned</button>
            <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem' }} onClick={() => handleBatchStatus('Wishlist')}>Mark Wishlist</button>
         </div>
      )}
      
      {filtered.length === 0 ? (
        <div className="empty-state">No photocards found matching your filters.</div>
      ) : (
        <div className="gallery-grid">
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
                  onDelete={currentUser && !batchMode ? () => deletePhotocard(card.id) : null} 
                  onEdit={currentUser && !batchMode ? () => setEditingCard(card) : null}
                  globalSettings={globalSettings}
                />
              </div>
            );
          })}
        </div>
      )}

      {editingCard && <EditCardModal card={editingCard} onClose={() => setEditingCard(null)} />}
    </>
  );
}
