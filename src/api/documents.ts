export interface DocumentUploadResponse {
  id: string;
  filename: string;
  file_size: number;
  upload_date: string;
  status: string;
}

export interface DocumentPublic {
  id: string;
  created_at: string;
  filename: string;
  content_type: string;
  is_processed: boolean;
  download_url: string;
}

export interface DocumentsPublic {
  data: DocumentPublic[];
  count: number;
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
  onProgress?: (progress: number) => void
): Promise<DocumentUploadResponse> => {
  const token = getAuthToken();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('chunk_size', chunkSize.toString());

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
  offset: number = 0
): Promise<DocumentsPublic> => {
  const token = getAuthToken();

  const url = new URL('http://localhost/api/v1/documents/');
  url.searchParams.append('limit', limit.toString());
  url.searchParams.append('offset', offset.toString());

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
