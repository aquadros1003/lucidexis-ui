import type { DocumentPublic } from '../api/schema/documents';
import type {
  DocumentCardProps,
  DocumentType,
  DocumentStatus,
  DocumentTag,
} from '../components/DocumentCard/DocumentCard';

const mapContentTypeToDocType = (contentType: string, filename: string): DocumentType => {
  // PDF
  if (contentType.includes('application/pdf')) return 'pdf';

  // Documents
  if (contentType.includes('application/msword') || contentType.includes('wordprocessingml')) return 'doc';
  if (contentType.includes('text/plain')) return 'txt';

  // Spreadsheets
  if (contentType.includes('application/vnd.ms-excel') || contentType.includes('spreadsheetml')) return 'xlsx';
  if (contentType.includes('text/csv')) return 'csv';

  // Images
  if (contentType.includes('image/jpeg')) return 'jpeg';
  if (contentType.includes('image/png')) return 'png';
  if (contentType.includes('image/gif')) return 'gif';
  if (contentType.includes('image/')) return 'image';

  // Fallback based on extension
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(ext || '')) return 'docx';
  if (['txt', 'text'].includes(ext || '')) return 'txt';
  if (['xls', 'xlsx'].includes(ext || '')) return 'xlsx';
  if (['csv'].includes(ext || '')) return 'csv';
  if (['jpg', 'jpeg'].includes(ext || '')) return 'jpeg';
  if (['png'].includes(ext || '')) return 'png';
  if (['gif'].includes(ext || '')) return 'gif';

  return 'other';
};

const generateMockTags = (filename: string): DocumentTag[] => {
  const tags: DocumentTag[] = [];

  const extension = filename.split('.').pop()?.toUpperCase();
  if (extension) {
    tags.push({ id: `ext-${extension}`, label: extension });
  }

  const lowerFilename = filename.toLowerCase();
  if (lowerFilename.includes('report')) {
    tags.push({ id: 'report', label: 'Report' });
  } else if (lowerFilename.includes('document') || lowerFilename.includes('doc')) {
    tags.push({ id: 'document', label: 'Document' });
  } else if (lowerFilename.includes('data') || lowerFilename.includes('analysis')) {
    tags.push({ id: 'data', label: 'Data' });
  }

  return tags;
};

const getDocumentStatus = (isProcessed: boolean): DocumentStatus => {
  return isProcessed ? 'active' : 'draft';
};

const fileSize = (doc: DocumentPublic): string => {
  return doc.file_size < 1024 * 1024
    ? `${(doc.file_size / 1024).toFixed(2)} KB`
    : `${(doc.file_size / (1024 * 1024)).toFixed(2)} MB`;
};

export const mapDocumentToCard = (doc: DocumentPublic): DocumentCardProps => {
  return {
    id: doc?.id,
    title: doc?.filename,
    downloadUrl: doc?.download_url,
    description: doc?.description,
    fileSize: fileSize(doc),
    status: getDocumentStatus(doc?.is_processed),
    type: mapContentTypeToDocType(doc?.content_type, doc?.filename),
    tags: generateMockTags(doc?.filename),
    date: new Date(doc?.created_at),
    authorName: doc?.owner ? doc?.owner.full_name : 'Unknown',
    category: doc?.category,
    isArchived: doc?.is_archived,
    isFavorite: doc?.is_favorite,
    isProcessed: doc?.is_processed,
  };
};

export const mapDocumentsToCards = (documents: DocumentPublic[]): DocumentCardProps[] => {
  return documents.map(mapDocumentToCard);
};
