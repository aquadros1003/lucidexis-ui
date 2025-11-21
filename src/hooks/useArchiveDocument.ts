import { useMutation, useQueryClient } from '@tanstack/react-query';
import { archiveDocument, unarchiveDocument, favoriteDocument, unfavoriteDocument } from '../api/hooks/documents';
import { toast } from 'sonner';

export function useArchiveDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => archiveDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['documentStats'] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error';
      console.error('Archive document error:', message);
      toast.error(`Something went wrong`);
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
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error';
      console.error('Unarchive document error:', message);
      toast.error(`Something went wrong`);
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
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error';
      console.error('Favorite document error:', message);
      toast.error(`Something went wrong`);
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
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error';
      console.error('Unfavorite document error:', message);
      toast.error(`Something went wrong`);
    },
  });
}
