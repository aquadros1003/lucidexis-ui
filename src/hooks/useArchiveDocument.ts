import { useMutation, useQueryClient } from '@tanstack/react-query';
import { archiveDocument, unarchiveDocument, favoriteDocument, unfavoriteDocument } from '../api/hooks/documents';

export function useArchiveDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => archiveDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['documentStats'] });
    },
  });
}

export function useUnarchiveDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => unarchiveDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['documentStats'] });
    },
  });
}

export function useFavoriteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => favoriteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['documentStats'] });
    },
  });
}

export function useUnfavoriteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => unfavoriteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['documentStats'] });
    },
  });
}
