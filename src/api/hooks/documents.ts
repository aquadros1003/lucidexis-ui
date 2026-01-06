import { fetchWithHeaders, getAuthToken } from '../client';
import { API_V1 } from '../../config';
import type {
  DocumentUploadResponse,
  DocumentsPublic,
  DocumentStats,
  UpdateDocumentRequest,
  DocumentPublic,
  DocumentPredictionResponse,
} from '../schema/documents';

export interface uploadDocumentParams {
  file: File;
  chunkSize?: number;
  description: string;
  category?: string;
  onProgress?: (progress: number) => void;
}

export const uploadDocument = async ({
  file,
  chunkSize = 1024,
  category = 'TECHNICAL',
  description,
  onProgress,
}: uploadDocumentParams): Promise<DocumentUploadResponse> => {
  const token = getAuthToken();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('chunk_size', chunkSize.toString());
  formData.append('description', description || '');
  formData.append('category', category || '');

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = Math.round((e.loaded / e.total) * 100);
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response: DocumentUploadResponse = JSON.parse(xhr.responseText);
          resolve(response);
        } catch {
          reject(new Error('Failed to parse server response'));
        }
      } else {
        try {
          const errorResponse = JSON.parse(xhr.responseText);
          reject(new Error(errorResponse.detail || `Upload failed with status ${xhr.status}`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error occurred during upload'));
    });

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload was cancelled'));
    });

    xhr.open('POST', `${API_V1}/documents/`);
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  });
};

export interface GetDocumentsParams {
  limit?: number;
  offset?: number;
  search?: string;
  isFavorite?: boolean;
  isArchived?: boolean;
}

export const getDocuments = async ({
  limit = 100,
  offset = 0,
  search,
  isFavorite,
  isArchived,
}: GetDocumentsParams = {}): Promise<DocumentsPublic> => {
  const url = new URL(`${API_V1}/documents/`);
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('offset', offset.toString());

  if (isFavorite !== undefined) {
    url.searchParams.append('is_favorite', isFavorite.toString());
  }

  if (isArchived !== undefined) {
    url.searchParams.append('is_archived', isArchived.toString());
  }

  if (search) {
    url.searchParams.append('search', search);
  }

  try {
    const data = await fetchWithHeaders(url.toString());
    return data as DocumentsPublic;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to fetch documents.');
  }
};

export const getDocumentStats = async (): Promise<DocumentStats> => {
  try {
    return (await fetchWithHeaders('/documents/stats')) as DocumentStats;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to fetch document statistics.');
  }
};

export const updateDocument = async (documentId: string, updates: UpdateDocumentRequest): Promise<DocumentPublic> => {
  try {
    return (await fetchWithHeaders(`/documents/${documentId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })) as DocumentPublic;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to update document.');
  }
};

export const archiveDocument = async (documentId: string): Promise<DocumentPublic> => {
  return updateDocument(documentId, { is_archived: true });
};

export const unarchiveDocument = async (documentId: string): Promise<DocumentPublic> => {
  return updateDocument(documentId, { is_archived: false });
};

export const favoriteDocument = async (documentId: string): Promise<DocumentPublic> => {
  return updateDocument(documentId, { is_favorite: true });
};

export const unfavoriteDocument = async (documentId: string): Promise<DocumentPublic> => {
  return updateDocument(documentId, { is_favorite: false });
};

export const deleteDocument = async (documentId: string): Promise<void> => {
  try {
    await fetchWithHeaders(`/documents/${documentId}`, { method: 'DELETE' });
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to delete document.');
  }
};

export const getDocumentMarkdownPreview = async (documentId: string): Promise<string> => {
  try {
    const content = await fetchWithHeaders(`/documents/${documentId}/preview/markdown`);
    const text = content as string;
    return text.replace(/^['"]|['"]$/g, '').replace(/\\n/g, '\n');
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to fetch document preview.');
  }
};

export const semanticSearch = async (searchQuery: string): Promise<DocumentPredictionResponse> => {
  try {
    return (await fetchWithHeaders('/documents/predict', {
      method: 'POST',
      body: JSON.stringify({ search_query: searchQuery }),
    })) as DocumentPredictionResponse;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : 'Failed to perform semantic search.');
  }
};
