import { fetchWithHeaders } from '../client';
import type { ConversationResponse, MessagesResponse } from '../schema/chat';

export const getLatestConversation = async (): Promise<ConversationResponse> => {
  return await fetchWithHeaders('/chat/latest');
};

export const getConversationMessages = async (conversationId: string): Promise<MessagesResponse> => {
  return await fetchWithHeaders(`/chat/${conversationId}/messages`);
};
