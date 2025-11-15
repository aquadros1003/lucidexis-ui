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

const getDocumentStatus = (isProcessed: boolean): DocumentStatus => {
  return isProcessed ? 'active' : 'draft';
};


const fileSize = (doc: DocumentPublic): string => {
  return doc.file_size < 1024 * 1024
    ? `${(doc.file_size / 1024).toFixed(2)} KB`
    : `${(doc.file_size / (1024 * 1024)).toFixed(2)} MB`;
}

export const mapDocumentToCard = (doc: DocumentPublic): DocumentCardProps => {
  return {
    id: doc.id,
    title: doc.filename,
    downloadUrl: doc.download_url,
    description: doc.description,
    fileSize: fileSize(doc),
    status: getDocumentStatus(doc.is_processed),
    type: mapContentTypeToDocType(doc.content_type),
    tags: generateMockTags(doc.filename),
    date: new Date(doc.created_at),
    authorName: doc.owner ? doc.owner.full_name : 'Unknown',
    isArchived: doc.is_archived,
    isFavorite: doc.is_favorite,
  };
};

export const mapDocumentsToCards = (documents: DocumentPublic[]): DocumentCardProps[] => {
  return documents.map(mapDocumentToCard);
};
