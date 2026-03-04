export interface UpdateUserRequest {
  full_name: string;
  locale: string;
}

export interface UpdateUserResponse {
  id: string;
  email: string;
  full_name: string;
  locale: string;
  is_active: boolean;
  is_superuser: boolean;
}

export interface ModelPreferences {
  llm_model: string;
  openai_api_url: string;
  openai_api_key: string;
  openai_system_prompt: string;
}

export interface UpdateModelPreferencesRequest {
  llm_model?: string;
  openai_api_url?: string;
  openai_api_key?: string;
  openai_system_prompt?: string;
}

export interface UpdateModelPreferencesResponse {
  llm_model: string;
  openai_api_url: string;
  openai_api_key: string;
  openai_system_prompt: string;
}

export interface GetModelPreferencesResponse {
  llm_model: string;
  openai_api_url: string;
  openai_api_key: string;
  openai_system_prompt: string;
}
