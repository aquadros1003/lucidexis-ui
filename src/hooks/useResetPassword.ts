import { useMutation } from '@tanstack/react-query';
import { resetPasswordApi } from '../api/hooks/auth';
import type { ResetPasswordRequest, ResetPasswordResponse } from '../api/schema/auth';

export function useResetPassword() {
  const mutation = useMutation<ResetPasswordResponse, Error, ResetPasswordRequest>({
    mutationFn: resetPasswordApi,
  });

  return {
    resetPassword: mutation.mutate,
    resetPasswordAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  };
}
