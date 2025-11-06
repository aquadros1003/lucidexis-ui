import type { DocumentPublic } from '../api/documents';
import type { DocumentCardProps, DocumentType, DocumentStatus, DocumentTag } from '../components/DocumentCard/DocumentCard';

const mapContentTypeToDocType = (contentType: string): DocumentType => {
  if (contentType.includes('application/pdf')) return 'pdf';
  if (contentType.includes('text/plain') || contentType.includes('document')) return 'doc';
  if (contentType.includes('text/csv') || contentType.includes('excel')) return 'sheet';
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

const generateMockDescription = (filename: string): string => {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  return `Document file: ${nameWithoutExt}. Click to view or download.`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  }
};

const getDocumentStatus = (isProcessed: boolean): DocumentStatus => {
  return isProcessed ? 'active' : 'draft';
};

export const mapDocumentToCard = (doc: DocumentPublic): DocumentCardProps => {
  return {
    id: doc.id,
    title: doc.filename,
    downloadUrl: doc.download_url,
    description: generateMockDescription(doc.filename),
    status: getDocumentStatus(doc.is_processed),
    type: mapContentTypeToDocType(doc.content_type),
    tags: generateMockTags(doc.filename),
    date: formatDate(doc.created_at),
  };
};

export const mapDocumentsToCards = (documents: DocumentPublic[]): DocumentCardProps[] => {
  return documents.map(mapDocumentToCard);
};
