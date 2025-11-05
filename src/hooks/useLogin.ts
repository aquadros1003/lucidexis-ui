import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/auth';
import type { LoginRequest, LoginResponse } from '../api/auth';
import { useAuthContext } from '../contexts';

export function useLogin() {
  const { setToken } = useAuthContext();

  const mutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: loginApi,
    onSuccess: (data) => {
      setToken(data.access_token);
    },
  });

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  };
}
