import { useState } from 'react';
import { usePhotocards } from '../hooks/usePhotocards';

export default function EditCardModal({ card, onClose }) {
  const { updatePhotocard } = usePhotocards();
  
  const [name, setName] = useState(card.name || '');
  const [group, setGroup] = useState(card.group || '');
  const [member, setMember] = useState(card.member || '');
  const [tagsInput, setTagsInput] = useState(card.tags?.join(', ') || '');
  const [status, setStatus] = useState(card.status || 'Owned');
  const [price, setPrice] = useState(card.price || '');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
      await updatePhotocard(card.id, { name, group, member, tags, status, price });
      onClose();
    } catch (err) {
      alert("Error updating photocard: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '600px' }}>
        <h2>✏️ Edit Photocard</h2>
        <form onSubmit={handleSubmit} className="add-card-form">
          <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
            <img src={card.imageUrl} alt={card.name} style={{ width: '150px', borderRadius: '8px', objectFit: 'cover' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input type="text" placeholder="Card Name" value={name} onChange={e => setName(e.target.value)} required className="input-field" />
                <input type="text" placeholder="Group Name" value={group} onChange={e => setGroup(e.target.value)} className="input-field" />
                <input type="text" placeholder="Member Name" value={member} onChange={e => setMember(e.target.value)} className="input-field" />
                <input type="text" placeholder="Tags (comma separated)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="input-field" />
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input type="number" step="0.01" min="0" placeholder="Est. Value / Price" value={price} onChange={e => setPrice(e.target.value)} className="input-field" />
                  <select value={status} onChange={e => setStatus(e.target.value)} className="input-field" style={{ cursor: 'pointer' }}>
                    <option value="Owned">✅ Owned</option>
                    <option value="Wishlist">💖 Wishlist</option>
                    <option value="On the Way">🚚 On the Way</option>
                    <option value="Traded">🔄 Traded</option>
                  </select>
                </div>
            </div>
          </div>
          
          <div className="modal-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" disabled={uploading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={uploading}>Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
