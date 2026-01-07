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
  category: string;
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
  technical_documents: number;
  marketing_documents: number;
  sales_documents: number;
  hr_documents: number;
  finance_documents: number;
  legal_documents: number;
  product_documents: number;
}

export interface UpdateDocumentRequest {
  description?: string;
  is_archived?: boolean;
  is_favorite?: boolean;
  category?: string;
}

export interface DocumentPrediction {
  document: DocumentPublic;
  chunk_content: string;
}

export interface DocumentPredictionResponse {
  predictions: DocumentPrediction[];
}
