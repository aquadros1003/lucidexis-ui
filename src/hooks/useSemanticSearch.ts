import { useMutation } from '@tanstack/react-query';
import { semanticSearch } from '../api/hooks/documents';
import type { DocumentPredictionResponse } from '../api/schema/documents';

export const useSemanticSearch = () => {
  return useMutation<DocumentPredictionResponse, Error, string>({
    mutationFn: (query: string) => semanticSearch(query),
  });
};
