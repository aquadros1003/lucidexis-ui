import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile, updateModelPreferences, getModelPreferences } from '../api/hooks/users';
import type { UpdateUserRequest, UpdateModelPreferencesRequest } from '../api/schema/users';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../contexts';

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { setUser } = useAuthContext();

  return useMutation({
    mutationFn: (data: UpdateUserRequest) => updateUserProfile(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      toast.success(t('common:profileSettings.profileUpdated'));
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error';
      console.error('Update profile error:', message);
      toast.error(t('common:errors.somethingWentWrong'));
    },
  });
}

export function useModelPreferences() {
  return useQuery({
    queryKey: ['modelPreferences'],
    queryFn: getModelPreferences,
  });
}

export function useUpdateModelPreferences() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (data: UpdateModelPreferencesRequest) => updateModelPreferences(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['modelPreferences'] });
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error';
      console.error('Update model preferences error:', message);
      toast.error(t('common:errors.somethingWentWrong'));
    },
  });
}
