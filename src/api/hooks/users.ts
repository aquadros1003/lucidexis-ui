import type {
  UpdateUserRequest,
  UpdateUserResponse,
  UpdateModelPreferencesRequest,
  UpdateModelPreferencesResponse,
  GetModelPreferencesResponse,
} from '../schema/users';
import { fetchWithHeaders } from '../client';

/**
 * Update current user profile
 */
export const updateUserProfile = async (data: UpdateUserRequest): Promise<UpdateUserResponse> => {
  return await fetchWithHeaders('/users/me', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

/**
 * Get current user model preferences
 */
export const getModelPreferences = async (): Promise<GetModelPreferencesResponse> => {
  return await fetchWithHeaders('/users/me/model-preferences', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Update current user model preferences
 */
export const updateModelPreferences = async (
  data: UpdateModelPreferencesRequest,
): Promise<UpdateModelPreferencesResponse> => {
  return await fetchWithHeaders('/users/me/model-preferences', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};
