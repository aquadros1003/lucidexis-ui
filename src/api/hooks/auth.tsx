import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  User,
} from '../schema/auth';
import { fetchWithHeaders } from '../client';

/**
 * Login to the API using form data
 */
export const loginApi = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  return await fetchWithHeaders('/login/access-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });
};

/**
 * Register a new user
 */
export const registerApi = async (data: RegisterRequest): Promise<RegisterResponse> => {
  return await fetchWithHeaders('/users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

/**
 * Request password recovery email
 */
export const forgotPasswordApi = async (email: string): Promise<ForgotPasswordResponse> => {
  return await fetchWithHeaders(`/password-recovery/${email}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Reset password with token
 */
export const resetPasswordApi = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  return await fetchWithHeaders('/reset-password/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

/**
 * Get current user information
 */
export const getCurrentUser = async (token: string): Promise<User> => {
  return await fetchWithHeaders('/users/me', {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};
