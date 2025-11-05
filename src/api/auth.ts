export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  is_active?: boolean;
  is_superuser?: boolean;
}

export interface ApiError {
  detail: string;
}

/**
 * Login to the API using form data
 */
export const loginApi = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await fetch('http://localhost/api/v1/login/access-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      detail: 'Login failed. Please check your credentials.',
    }));
    throw new Error(error.detail);
  }

  return response.json();
};

/**
 * Get current user information
 */
export const getCurrentUser = async (token: string): Promise<User> => {
  const response = await fetch('http://localhost/api/v1/users/me', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      detail: 'Failed to fetch user information.',
    }));
    throw new Error(error.detail);
  }

  return response.json();
};
