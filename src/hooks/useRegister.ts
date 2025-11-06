import { useMutation } from '@tanstack/react-query';
import { registerApi } from '../api/auth';
import type { RegisterRequest, RegisterResponse } from '../api/auth';

export function useRegister() {
  const mutation = useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: registerApi,
  });

  return {
    register: mutation.mutate,
    registerAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  };
}
