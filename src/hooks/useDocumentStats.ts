import { useQuery } from '@tanstack/react-query';
import { getDocumentStats } from '../api/documents';

export function useDocumentStats() {
  return useQuery({
    queryKey: ['documentStats'],
    queryFn: getDocumentStats,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
}
