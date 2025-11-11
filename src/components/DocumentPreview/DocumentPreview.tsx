import React from 'react';
import { useAuthContext } from '../../contexts';
import { downloadFile } from '../../utils/downloadFile';
import type { DocumentCardProps } from '../DocumentCard/DocumentCard';
import './DocumentPreview.scss';

interface DocumentPreviewProps {
  document: DocumentCardProps;
  onClose: () => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  onClose,
  onArchive,
  onDelete,
}) => {
  const { token } = useAuthContext();

  const handleDownload = async () => {
    try {
      await downloadFile(document.downloadUrl, document.title, token);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive(document.id);
    }
  };

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this document?')) {
      onDelete(document.id);
    }
  };

  // Mock data
  const fileType = document.type === 'pdf' ? 'DOCX' : document.type.toUpperCase();
  const fileSize = '1.8 MB';
  const author = 'John Doe';
  const category = 'Technical';
  const createdDate = document.date;
  const lastModified = document.date;
  const permissions = [
    'Can be viewed by all team members',
    'Can be edited by document owner and admins',
    'Can be shared externally with approval',
  ];

  return (
    <div className="document-preview">
      <div className="document-preview__header">
          <div className="document-preview__header-content">
            <div className="document-preview__icon">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="document-preview__header-info">
              <h2 className="document-preview__title">{document.title}</h2>
            </div>
          </div>
          <button 
            className="document-preview__close" 
            onClick={onClose}
            aria-label="Close preview"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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

        <div className="document-preview__actions">
          <button 
            className="document-preview__action-btn"
            onClick={handleDownload}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 10.5V2M8 10.5L5.5 8M8 10.5L10.5 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Download
          </button>
          <button 
            className="document-preview__action-btn"
            onClick={handleArchive}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="3" width="14" height="3" rx="1" stroke="currentColor" strokeWidth="1.5"/>
              <path
                d="M4 6v9a2 2 0 002 2h8a2 2 0 002-2V6M8 9v4m4-4v4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Archive
          </button>
          <button 
            className="document-preview__action-btn document-preview__action-btn--danger"
            onClick={handleDelete}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 6h14M8 9v6m4-6v6M4 6l1 10a1 1 0 001 1h8a1 1 0 001-1l1-10M7 6V4a1 1 0 011-1h4a1 1 0 011 1v2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Delete
          </button>
        </div>


        <div className="document-preview__content">
        <div className="document-preview__tabs">
          <button className="document-preview__tab document-preview__tab--active">
            Details
          </button>
          <button className="document-preview__tab">
            Preview
          </button>
          <button className="document-preview__tab">
            Activity
          </button>
        </div>
          <section className="document-preview__section">
            <h3 className="document-preview__section-title">Description</h3>
            <p className="document-preview__description">{document.description}</p>
          </section>

          <section className="document-preview__section">
            <div className="document-preview__info-row">
              <div className="document-preview__info-col">
                <div className="document-preview__info-item">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 1v3h6V1M3 3h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div>
                    <div className="document-preview__info-label">File Type</div>
                    <div className="document-preview__info-value">{fileType}</div>
                  </div>
                </div>

                <div className="document-preview__info-item">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="8"
                      cy="5"
                      r="2.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M2 13c0-2.5 2.5-4 6-4s6 1.5 6 4"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div>
                    <div className="document-preview__info-label">Author</div>
                    <div className="document-preview__info-value">{author}</div>
                  </div>
                </div>

                <div className="document-preview__info-item">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="2"
                      y="3"
                      width="12"
                      height="11"
                      rx="1.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M5 1.5v2M11 1.5v2M2 6h12"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div>
                    <div className="document-preview__info-label">Created Date</div>
                    <div className="document-preview__info-value">{createdDate}</div>
                  </div>
                </div>
              </div>

              <div className="document-preview__info-col">
                <div className="document-preview__info-item">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 8H8L6 10L8 12H13C13.5523 12 14 11.5523 14 11V9C14 8.44772 13.5523 8 13 8Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 8V4C2 3.44772 2.44772 3 3 3H13C13.5523 3 14 3.44772 14 4V5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div>
                    <div className="document-preview__info-label">File Size</div>
                    <div className="document-preview__info-value">{fileSize}</div>
                  </div>
                </div>

                <div className="document-preview__info-item">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.333 7.583L6.125 11.375a.583.583 0 00.825 0l4.375-4.375a.583.583 0 000-.825L7.533 2.383a.583.583 0 00-.825 0L2.333 6.758a.583.583 0 000 .825z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div>
                    <div className="document-preview__info-label">Category</div>
                    <div className="document-preview__info-value">
                      <span className="category-badge">{category}</span>
                    </div>
                  </div>
                </div>

                <div className="document-preview__info-item">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="6"
                      stroke="currentColor"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M8 4v4l2.5 2.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div>
                    <div className="document-preview__info-label">Last Modified</div>
                    <div className="document-preview__info-value">{lastModified}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {document.tags.length > 0 && (
            <section className="document-preview__section">
              <h3 className="document-preview__section-title">Tags</h3>
              <div className="document-preview__tags">
                {document.tags.map((tag) => (
                  <span key={tag.id} className="document-preview__tag">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.333 7.583L6.125 11.375a.583.583 0 00.825 0l4.375-4.375a.583.583 0 000-.825L7.533 2.383a.583.583 0 00-.825 0L2.333 6.758a.583.583 0 000 .825z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="5.25" cy="5.25" r="0.583" fill="currentColor" />
                    </svg>
                    {tag.label}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="document-preview__section">
            <h3 className="document-preview__section-title">Permissions</h3>
            <ul className="document-preview__permissions">
              {permissions.map((permission, index) => (
                <li key={index} className="document-preview__permission">
                  • {permission}
                </li>
              ))}
            </ul>
          </section>
        </div>
    </div>
  );
};

export default DocumentPreview;
