import { usePhotocards } from '../hooks/usePhotocards';
import { useAuth } from '../hooks/useAuth';
import PhotocardItem from './PhotocardItem';
import EditCardModal from './EditCardModal';
import FilterBar from './FilterBar';
import { useState, useMemo } from 'react';

export default function GalleryGrid({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, groupFilter, setGroupFilter }) {
  const { photocards, loading, deletePhotocard } = usePhotocards();
  const { currentUser } = useAuth();
  const [editingCard, setEditingCard] = useState(null);

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

  if (filtered.length === 0) {
    return <div className="empty-state">No photocards found. Add some to get started!</div>;
  }

  return (
    <>
      <FilterBar 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        groupFilter={groupFilter} setGroupFilter={setGroupFilter}
        uniqueGroups={uniqueGroups}
      />
      
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
