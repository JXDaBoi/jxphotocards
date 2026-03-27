import { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { uploadImageToCloudinary } from '../services/cloudinary';
import { usePhotocards } from '../hooks/usePhotocards';
import { useAuth } from '../hooks/useAuth';

export default function AddCardModal({ onClose }) {
  const { addPhotocard } = usePhotocards();
  const { currentUser } = useAuth();
  const cropperRef = useRef(null);
  
  const [step, setStep] = useState('select');
  const [imageSrc, setImageSrc] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Cropper settings
  const [aspect, setAspect] = useState(NaN); // NaN is free resize
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragMode, setDragMode] = useState('move'); // 'move' allows panning
  const [croppedBlob, setCroppedBlob] = useState(null);

  // Metadata
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [member, setMember] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState('Owned');
  const [price, setPrice] = useState('');

  const onFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setStep('crop');
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleZoomInput = (e) => {
    const val = parseFloat(e.target.value);
    setZoomLevel(val);
    if (cropperRef.current?.cropper && !isNaN(val)) {
      cropperRef.current.cropper.zoomTo(val);
    }
  };

  const handleCropComplete = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      cropperRef.current.cropper.getCroppedCanvas({
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      }).toBlob((blob) => {
        if (!blob) return alert('Failed to process image');
        setCroppedBlob(blob);
        setStep('details');
      }, 'image/jpeg', 0.9);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!croppedBlob) return alert("Missing cropped image");

    setUploading(true);
    try {
      const fileToUpload = new File([croppedBlob], `photocard_${Date.now()}.jpg`, { type: 'image/jpeg' });
      const imageUrl = await uploadImageToCloudinary(fileToUpload);
      const tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
      await addPhotocard({ name, group, member, tags, status, price, imageUrl }, currentUser?.uid);
      onClose();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '900px', width: '95%' }}>
        
        {step === 'select' && (
          <div className="text-center">
            <h2>Select Image to Process</h2>
            <input type="file" accept="image/*" onChange={onFileChange} style={{ marginTop: '2rem', display: 'block', width: '100%' }} />
            <div className="modal-actions" style={{ justifyContent: 'center', marginTop: '2rem' }}>
              <button className="btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </div>
        )}

        {step === 'crop' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '700px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className={`btn-secondary ${dragMode === 'move' ? 'active' : ''}`} onClick={() => setDragMode('move')}>✋ Pan Image</button>
                  <button className={`btn-secondary ${dragMode === 'crop' ? 'active' : ''}`} onClick={() => setDragMode('crop')}>✂️ Draw Box</button>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className={`btn-secondary ${isNaN(aspect) ? 'active' : ''}`} onClick={() => setAspect(NaN)}>Free Form</button>
                  <button className={`btn-secondary ${aspect === 3/4 ? 'active' : ''}`} onClick={() => setAspect(3/4)}>3:4 Vertical</button>
                  <button className={`btn-secondary ${aspect === 1 ? 'active' : ''}`} onClick={() => setAspect(1)}>1:1 Square</button>
              </div>
            </div>
            
            <div style={{ flex: 1, minHeight: 0, background: '#111', borderRadius: '8px', overflow: 'hidden' }}>
              <Cropper
                ref={cropperRef}
                style={{ height: '100%', width: '100%' }}
                aspectRatio={aspect}
                src={imageSrc}
                viewMode={1}
                minCropBoxHeight={100}
                minCropBoxWidth={100}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                guides={true}
                dragMode={dragMode}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', background: 'var(--card-bg)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                <span style={{ fontWeight: 600 }}>Manual Zoom: </span>
                <input 
                  type="number" 
                  min="0.1" 
                  max="10" 
                  step="0.1" 
                  value={zoomLevel} 
                  onChange={handleZoomInput} 
                  className="input-field"
                  style={{ width: '80px', marginBottom: 0 }}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>x (You can also use your mouse wheel)</span>
            </div>

            <div className="modal-actions" style={{ marginTop: '1.5rem', justifyContent: 'space-between' }}>
              <button className="btn-secondary" onClick={() => setStep('select')}>Back</button>
              <button className="btn-primary" onClick={handleCropComplete}>Confirm Shape</button>
            </div>
          </div>
        )}

        {step === 'details' && (
          <div>
            <h2>Enter Details</h2>
            <form onSubmit={handleSubmit} className="add-card-form">
              <input type="text" placeholder="Card Name (e.g. Psycho Ver. A)" value={name} onChange={e => setName(e.target.value)} required className="input-field" />
              <input type="text" placeholder="Group (e.g. Red Velvet)" value={group} onChange={e => setGroup(e.target.value)} className="input-field" />
              <input type="text" placeholder="Member (e.g. Irene)" value={member} onChange={e => setMember(e.target.value)} className="input-field" />
              <input type="text" placeholder="Tags (comma separated, e.g. Selfie, Rare)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} className="input-field" />
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input type="number" step="0.01" min="0" placeholder="Est. Value (e.g. 15.50)" value={price} onChange={e => setPrice(e.target.value)} className="input-field" />
                <select value={status} onChange={e => setStatus(e.target.value)} className="input-field" style={{ cursor: 'pointer' }}>
                    <option value="Owned">✅ Owned</option>
                    <option value="Wishlist">💖 Wishlist</option>
                    <option value="On the Way">🚚 On the Way</option>
                    <option value="Traded">🔄 Traded</option>
                </select>
              </div>

              <div className="modal-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', marginTop: '1rem' }}>
                <button type="button" onClick={() => setStep('crop')} className="btn-secondary" disabled={uploading}>Back</button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={onClose} className="btn-secondary" disabled={uploading}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={uploading}>{uploading ? 'Uploading...' : 'Upload Photocard'}</button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
