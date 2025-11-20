import { useMutation } from '@tanstack/react-query';
import { forgotPasswordApi } from '../api/hooks/auth';
import type { ForgotPasswordResponse } from '../api/schema/auth';

export function useForgotPassword() {
  const mutation = useMutation<ForgotPasswordResponse, Error, string>({
    mutationFn: forgotPasswordApi,
  });

  return {
    forgotPassword: mutation.mutate,
    forgotPasswordAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  };
}
