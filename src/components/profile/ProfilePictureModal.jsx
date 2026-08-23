import { useCallback, useRef, useState } from 'react';
import { X, UploadCloud, Trash2, UserRound } from 'lucide-react';
import './ProfilePictureModal.css';

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function ProfilePictureModal({ currentImage, onClose, onSave, onRemove }) {
  const [previewUrl, setPreviewUrl] = useState(currentImage || null);
  const [pendingFile, setPendingFile] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const validateAndSetFile = useCallback((file) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WEBP image.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be smaller than ${MAX_SIZE_MB}MB.`);
      return;
    }

    setError('');
    setPendingFile(file);

    // Base64 data URL instead of a blob URL — blob URLs die on page refresh,
    // data URLs are just strings and survive being saved to localStorage.
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => setIsDraggingOver(false);

  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleFileInputChange = (e) => {
    validateAndSetFile(e.target.files?.[0]);
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setPendingFile(null);
    setError('');
  };

  const handleSave = () => {
    if (pendingFile) {
      onSave(pendingFile, previewUrl);
    } else if (previewUrl === null && currentImage) {
      onRemove();
    }
    onClose();
  };

  const hasChange = pendingFile !== null || (previewUrl === null && currentImage);

  return (
    <div className="picture-modal-overlay" onClick={onClose}>
      <div className="picture-modal" onClick={(e) => e.stopPropagation()}>
        <div className="picture-modal__header">
          <h2>Profile photo</h2>
          <button className="picture-modal__close" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div
          className={`picture-modal__dropzone${isDraggingOver ? ' picture-modal__dropzone--active' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleBrowseClick}
          role="button"
          tabIndex={0}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="Profile preview" className="picture-modal__preview" />
          ) : (
            <div className="picture-modal__placeholder">
              <UserRound size={40} />
            </div>
          )}

          <div className="picture-modal__dropzone-hint">
            <UploadCloud size={18} />
            <p>
              <span className="picture-modal__link-text">Click to upload</span> or drag and drop
            </p>
            <span className="picture-modal__filetypes">JPG, PNG or WEBP · up to {MAX_SIZE_MB}MB</span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleFileInputChange}
            hidden
          />
        </div>

        {error && <p className="picture-modal__error">{error}</p>}

        {previewUrl && (
          <button type="button" className="picture-modal__remove" onClick={handleRemove}>
            <Trash2 size={15} />
            Remove current photo
          </button>
        )}

        <div className="picture-modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn--primary" onClick={handleSave} disabled={!hasChange}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}