import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import GalleryGrid from '../components/GalleryGrid';
import FilterBar from '../components/FilterBar';
import AddCardModal from '../components/AddCardModal';
import { useToast } from '../hooks/ToastContext';
import { usePhotocards } from '../hooks/usePhotocards';

export default function CollectionManager() {
  const { currentUser, globalSettings } = useOutletContext();
  const { photocards, loading, deletePhotocard, updatePhotocard } = usePhotocards(currentUser.uid);
  const [showAddModal, setShowAddModal] = useState(false);
  const { addToast } = useToast();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [groupFilter, setGroupFilter] = useState('All');
  
  const uniqueGroups = useMemo(() => {
    const groups = new Set(photocards.map(c => c.group).filter(Boolean));
    return Array.from(groups).sort();
  }, [photocards]);

  return (
    <div className="collection-manager">
      <div className="manager-header glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Collection</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage and organize your photocards.</p>
          </div>
          <button className="btn-primary flex-btn" onClick={() => setShowAddModal(true)} style={{ fontSize: '1.1rem', padding: '0.8rem 1.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>+</span> Add New Card
          </button>
        </div>
      </div>

      <div className="manager-controls">
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <FilterBar 
            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            groupFilter={groupFilter} setGroupFilter={setGroupFilter}
            uniqueGroups={uniqueGroups}
          />
        </div>
      </div>

      <div className="manager-grid-area">
        <GalleryGrid 
           photocards={photocards}
           loading={loading}
           deletePhotocard={deletePhotocard}
           updatePhotocard={updatePhotocard}
           searchQuery={searchQuery}
           statusFilter={statusFilter}
           groupFilter={groupFilter}
           globalSettings={globalSettings}
           isAdminView={true}
        />
      </div>

      {showAddModal && <AddCardModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
