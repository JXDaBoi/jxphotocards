import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { uploadImageToCloudinary } from '../services/cloudinary';
import { usePhotocards } from '../hooks/usePhotocards';
import getCroppedImg from '../utils/cropImage';

export default function AddCardModal({ onClose }) {
  const { addPhotocard } = usePhotocards();
  
  // Steps: 'select' -> 'crop' -> 'details'
  const [step, setStep] = useState('select');
  
  // Image state
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedBlob, setCroppedBlob] = useState(null);

  // Metadata state
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [member, setMember] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  
  // UI state
  const [uploading, setUploading] = useState(false);

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result);
        setStep('crop');
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirmCrop = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedBlob(croppedImageBlob);
      setStep('details');
    } catch (e) {
      console.error(e);
      alert("Error cropping image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!croppedBlob) return alert("Missing cropped image");

    setUploading(true);
    try {
      // 1. Convert Blob to File
      const fileToUpload = new File([croppedBlob], `photocard_${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // 2. Upload to Cloudinary
      const imageUrl = await uploadImageToCloudinary(fileToUpload);
      
      // 3. Save to Firestore
      const tags = tagsInput.split(',').map(tag => tag.trim()).filter(Boolean);
      await addPhotocard({ name, group, member, tags, imageUrl });

      onClose();
    } catch (err) {
      alert("Error uploading to Firebase/Cloudinary: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        
        {step === 'select' && (
          <div className="text-center">
            <h2>Select Image to Crop</h2>
            <input type="file" accept="image/*" onChange={onFileChange} style={{ marginTop: '2rem', display: 'block', width: '100%' }} />
            <div className="modal-actions" style={{ justifyContent: 'center', marginTop: '2rem' }}>
              <button className="btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </div>
        )}

        {step === 'crop' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
            <h2 style={{ marginBottom: '1rem' }}>Crop to Photocard (3:4)</h2>
            <div className="crop-container" style={{ position: 'relative', flex: 1, background: '#333', borderRadius: '8px', overflow: 'hidden' }}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={3 / 4}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div style={{ marginTop: '1rem' }}>
               <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(e.target.value)} style={{ width: '100%' }} />
            </div>
            <div className="modal-actions" style={{ marginTop: '1rem', justifyContent: 'space-between' }}>
              <button className="btn-secondary" onClick={() => setStep('select')}>Back</button>
              <button className="btn-primary" onClick={handleConfirmCrop}>Confirm Crop</button>
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
