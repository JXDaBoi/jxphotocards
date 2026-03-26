import { usePhotocards } from '../hooks/usePhotocards';
import { useAuth } from '../hooks/useAuth';
import PhotocardItem from './PhotocardItem';

export default function GalleryGrid({ selectedTag }) {
  const { photocards, loading, deletePhotocard } = usePhotocards();
  const { currentUser } = useAuth();

  if (loading) return <div className="loader">Loading your collection...</div>;

  const filtered = selectedTag 
    ? photocards.filter(card => card.tags?.includes(selectedTag))
    : photocards;

  if (filtered.length === 0) {
    return <div className="empty-state">No photocards found. Add some to get started!</div>;
  }

  return (
    <div className="gallery-grid">
      {filtered.map(card => (
        <PhotocardItem 
          key={card.id} 
          card={card} 
          onDelete={currentUser ? () => deletePhotocard(card.id) : null} 
        />
      ))}
    </div>
  );
}
