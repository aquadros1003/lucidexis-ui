import { useState, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { uploadDocument } from '../../api/documents';
import { Loader } from '../Loader';
import './DocumentUpload.scss';

interface DocumentUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

export function DocumentUpload({ isOpen, onClose, onUploadSuccess }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>('Invoice for services rendered');
  const [chunkSize, setChunkSize] = useState<number>(1024);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const result = await uploadDocument(
        file, 
        chunkSize, 
        (progress: number) => {
          setUploadProgress(progress);
        },
        description
      );
      
      console.log('Upload successful:', result);
      
      // Reset form
      setFile(null);
      setDescription('');
      setChunkSize(1024);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Call success callback
      onUploadSuccess?.();
      
      // Close modal
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setFile(null);
      setDescription('Invoice for services rendered');
      setError(null);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="document-upload-overlay" onClick={handleClose}>
      <div className="document-upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="document-upload-modal__header">
          <h2>Upload Document</h2>
          <button
            className="document-upload-modal__close"
            onClick={handleClose}
            disabled={isUploading}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="document-upload-modal__form">
          <div
            className={`document-upload-modal__dropzone ${file ? 'document-upload-modal__dropzone--has-file' : ''}`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="document-upload-modal__file-input"
              disabled={isUploading}
            />
            
            {file ? (
              <div className="document-upload-modal__file-info">
                <svg className="document-upload-modal__file-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2v6h6M16 13H8m8 4H8m2-8H8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="document-upload-modal__file-details">
                  <p className="document-upload-modal__file-name">{file.name}</p>
                  <p className="document-upload-modal__file-size">
                    {file.size < 1024 * 1024 
                      ? `${(file.size / 1024).toFixed(2)} KB`
                      : `${(file.size / 1024 / 1024).toFixed(2)} MB`
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="document-upload-modal__dropzone-content">
                <svg className="document-upload-modal__upload-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="document-upload-modal__dropzone-text">
                  <strong>Click to upload</strong> or drag and drop
                </p>
                <p className="document-upload-modal__dropzone-hint">
                  PDF, DOC, DOCX, TXT or any document file
                </p>
              </div>
            )}
          </div>

          <div className="document-upload-modal__description">
            <label className="document-upload-modal__label">
              <span>Description</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add description for this document..."
                className="document-upload-modal__textarea"
                rows={3}
                disabled={isUploading}
              />
            </label>
          </div>

          {isUploading && (
            <div className="document-upload-modal__progress">
              <div className="document-upload-modal__progress-bar">
                <div
                  className="document-upload-modal__progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="document-upload-modal__progress-text">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          <div className="document-upload-modal__settings">
            <label className="document-upload-modal__label">
              <div className="document-upload-modal__label-header">
                <span>Chunk Size</span>
                <span className="document-upload-modal__value">{chunkSize} bytes</span>
              </div>
              <input
                type="range"
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
                min={512}
                max={8192}
                step={512}
                className="document-upload-modal__slider"
                disabled={isUploading}
              />
            </label>
          </div>

          {error && (
            <div className="document-upload-modal__error">
              {error}
            </div>
          )}

          <div className="document-upload-modal__actions">
            <button
              type="button"
              onClick={handleClose}
              className="document-upload-modal__button document-upload-modal__button--secondary"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="document-upload-modal__button document-upload-modal__button--primary"
              disabled={!file || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader size="small" />
                  <span>Uploading...</span>
                </>
              ) : (
                'Upload'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
