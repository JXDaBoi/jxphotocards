import { usePhotocards } from '../hooks/usePhotocards';
import { useAuth } from '../hooks/useAuth';
import PhotocardItem from './PhotocardItem';
import EditCardModal from './EditCardModal';
import FilterBar from './FilterBar';
import Dashboard from './Dashboard';
import LightboxModal from './LightboxModal';
import { useState, useMemo } from 'react';
import html2canvas from 'html2canvas';

export default function GalleryGrid({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, groupFilter, setGroupFilter, globalSettings, isAdminView, adminId }) {
  const { photocards, loading, deletePhotocard, updatePhotocard } = usePhotocards(adminId);
  const { currentUser } = useAuth();
  const [editingCard, setEditingCard] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [gridSize, setGridSize] = useState('medium');
  const [inspectedCard, setInspectedCard] = useState(null);
  const [exporting, setExporting] = useState(false);

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

  const handleExportWishlist = async () => {
    setExporting(true);
    try {
      const el = document.getElementById('wishlist-export-container');
      const canvas = await html2canvas(el, { useCORS: true, backgroundColor: '#111' });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'wishlist.png';
      link.href = imgData;
      link.click();
    } catch (e) {
      alert("Export failed: " + e.message);
    }
    setExporting(false);
  };

  return (
    <div className={!globalSettings?.showcaseMode ? 'dashboard-layout' : ''}>
      
      {!globalSettings?.showcaseMode && (
        <>
          <button 
            className="btn-primary mobile-filter-toggle"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          >
            {mobileFiltersOpen ? '▲ Hide Advanced Tools' : '▼ Open Filters & Analytics'}
          </button>

          <aside className={`sidebar desktop-sidebar glass-panel ${mobileFiltersOpen ? 'mobile-open' : ''}`} style={{ padding: '0.5rem' }}>
            <FilterBar 
              searchQuery={searchQuery} setSearchQuery={setSearchQuery}
              statusFilter={statusFilter} setStatusFilter={setStatusFilter}
              groupFilter={groupFilter} setGroupFilter={setGroupFilter}
              uniqueGroups={uniqueGroups}
            />
          </aside>
        </>
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
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-secondary" onClick={handleExportWishlist} disabled={exporting}>
                  {exporting ? '📸 Generating...' : '📸 Export Wishlist'}
                </button>
                <button 
                  className={`btn-secondary ${batchMode ? 'active' : ''}`} 
                  onClick={() => { setBatchMode(!batchMode); setSelectedCards(new Set()); }}
                  style={batchMode ? { background: 'var(--accent)', color: 'white' } : {}}
                >
                  {batchMode ? 'Cancel Selection' : '⚡ Batch Edit'}
                </button>
              </div>
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
                    onInspect={setInspectedCard}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>

      {!globalSettings?.showcaseMode && globalSettings?.dashboardEnabled && (
        <aside className={`sidebar desktop-sidebar ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
          <Dashboard photocards={photocards} globalSettings={globalSettings} />
        </aside>
      )}

      {/* Hidden container for HTML2Canvas Wishlist Generation */}
      <div id="wishlist-export-container" style={{ position: 'absolute', top: '-9999px', width: '1000px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', background: '#111', padding: '30px', borderRadius: '15px' }}>
        <h2 style={{ gridColumn: '1 / -1', color: 'white', textAlign: 'center', marginBottom: '10px', fontFamily: 'sans-serif' }}>💖 My Photocard Wishlist</h2>
        {photocards.filter(c => c.status === 'Wishlist').map(c => (
           <div key={c.id} style={{ background: '#222', padding: '10px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <img src={c.imageUrl} crossOrigin="anonymous" style={{ width: '100%', height: '300px', objectFit: 'contain', background: '#000', borderRadius: '5px' }} />
              <div style={{ color: 'white', textAlign: 'center', fontFamily: 'sans-serif' }}>
                 <strong style={{ fontSize: '14px' }}>{c.name}</strong>
                 <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>{c.group} {c.member}</p>
              </div>
           </div>
        ))}
      </div>

      {editingCard && <EditCardModal card={editingCard} onClose={() => setEditingCard(null)} />}
      <LightboxModal card={inspectedCard} onClose={() => setInspectedCard(null)} />
    </div>
  );
}
