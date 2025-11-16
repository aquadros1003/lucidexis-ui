export interface DocumentUploadResponse {
  id: string;
  filename: string;
  file_size: number;
  upload_date: string;
  status: string;
}

export interface DocumentOwner {
  id: string;
  full_name: string;
  email: string;
}

export interface DocumentPublic {
  id: string;
  created_at: string;
  filename: string;
  file_size: number;
  content_type: string;
  is_processed: boolean;
  is_archived: boolean;
  is_favorite: boolean;
  description: string;
  download_url: string;
  owner?: DocumentOwner;
}

export interface DocumentsPublic {
  data: DocumentPublic[];
  count: number;
}

export interface DocumentStats {
  total_documents: number;
  archived_documents: number;
  favorite_documents: number;
}

export interface UpdateDocumentRequest {
  description?: string;
  is_archived?: boolean;
  is_favorite?: boolean;
}

/**
 * Helper function to get token from localStorage
 */
const getAuthToken = (): string => {
  const tokenRaw = localStorage.getItem('access_token');
  
  if (!tokenRaw) {
    throw new Error('No authentication token found. Please log in.');
  }

  try {
    // Parse token to remove quotes added by JSON.stringify
    return JSON.parse(tokenRaw);
  } catch {
    // If parsing fails, return raw token (backwards compatibility)
    return tokenRaw;
  }
};

/**
 * Upload a document to the server
 */
export const uploadDocument = async (
  file: File,
  chunkSize: number = 1024,
  onProgress?: (progress: number) => void,
  description?: string
): Promise<DocumentUploadResponse> => {
  const token = getAuthToken();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('chunk_size', chunkSize.toString());
  formData.append('description', description || '');

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

    xhr.open('POST', 'http://localhost/api/v1/documents/');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  });
};

export const getDocuments = async (
  limit: number = 100,
  offset: number = 0,
  isFavorite?: boolean,
  isArchived?: boolean,
  search?: string
): Promise<DocumentsPublic> => {
  const token = getAuthToken();

  const url = new URL('http://localhost/api/v1/documents/');
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

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: 'Failed to fetch documents.',
    }));
    throw new Error(error.detail);
  }

  return response.json();
};

export const getDocumentStats = async (): Promise<DocumentStats> => {
  const token = getAuthToken();

  const response = await fetch('http://localhost/api/v1/documents/stats', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: 'Failed to fetch document statistics.',
    }));
    throw new Error(error.detail);
  }

  return response.json();
};

export const updateDocument = async (
  documentId: string,
  updates: UpdateDocumentRequest
): Promise<DocumentPublic> => {
  const token = getAuthToken();

  const response = await fetch(`http://localhost/api/v1/documents/${documentId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: 'Failed to update document.',
    }));
    throw new Error(error.detail);
  }

  return response.json();
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
  const token = getAuthToken();

  const response = await fetch(`http://localhost/api/v1/documents/${documentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: 'Failed to delete document.',
    }));
    throw new Error(error.detail);
  }
};
