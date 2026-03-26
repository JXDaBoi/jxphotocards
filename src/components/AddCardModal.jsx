import { useState } from 'react';
import { uploadImageToCloudinary } from '../services/cloudinary';
import { usePhotocards } from '../hooks/usePhotocards';

export default function AddCardModal({ onClose }) {
  const { addPhotocard } = usePhotocards();
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [member, setMember] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an image");
      return;
    }

    setUploading(true);
    try {
      // 1. Upload image to Cloudinary
      const imageUrl = await uploadImageToCloudinary(file);
      
      // 2. Save metadata to Firestore
      const tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
      
      await addPhotocard({
        name,
        group,
        member,
        tags,
        imageUrl
      });

      onClose();
    } catch (err) {
      alert("Error adding card: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <h2>Add New Photocard</h2>
        <form onSubmit={handleSubmit} className="add-card-form">
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} required />
          <input type="text" placeholder="Card Name (e.g. Psycho Ver. A)" value={name} onChange={e => setName(e.target.value)} required className="input-field" />
          <input type="text" placeholder="Group (e.g. Red Velvet)" value={group} onChange={e => setGroup(e.target.value)} className="input-field" />
          <input type="text" placeholder="Member (e.g. Irene)" value={member} onChange={e => setMember(e.target.value)} className="input-field" />
          <input type="text" placeholder="Tags (comma separated, e.g. Selfie, Rare)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="input-field" />
          
          <div className="modal-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" disabled={uploading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={uploading}>{uploading ? 'Uploading...' : 'Save Photocard'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
