import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDocument } from '../api/hooks/documents';
import { toast } from 'sonner';

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['documentStats'] });
      toast.success('Document deleted successfully.');
    },
    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : 'An error occurred while deleting the document.'
      );
    }
  });
}
