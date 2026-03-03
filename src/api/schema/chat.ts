export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  conversation_id: string;
  created_at: string;
  additional_data?: unknown;
}

export interface ConversationResponse {
  conversation: Conversation;
}

export interface MessagesResponse {
  messages: ChatMessage[];
}
