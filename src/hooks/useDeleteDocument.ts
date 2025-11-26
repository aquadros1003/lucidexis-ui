import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDocument } from '../api/hooks/documents';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function useDeleteDocument() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['documentStats'] });
      toast.success(t('dashboard.documentDeletedSuccessfully'));
    },
    onError: () => {
      toast.error(t('errors.SomethingWentWrong'));
    },
  });
}
