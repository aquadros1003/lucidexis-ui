import { useEffect, useRef, useState, useCallback } from 'react';
import type { ChatModelAdapter } from '@assistant-ui/react';
import { API_BASE } from '../../config';

interface WebSocketMessage {
  type: string;
  message?: {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    conversation_id: string;
    additional_data?: unknown;
  };
  content?: string;
  delta?: string;
  error?: string;
  status?: string;
}

export const useWebSocketRuntime = (
  conversationId: string | undefined,
  token: string | undefined,
): ChatModelAdapter | null => {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const currentStreamRef = useRef<{
    controller: ReadableStreamDefaultController<{
      content: Array<{ type: string; text: string; additionalData?: unknown }>;
    }>;
    text: string;
  } | null>(null);

  const constructWebSocketUrl = useCallback(() => {
    if (!conversationId || !token) return null;
    const baseUrl = API_BASE.replace(/^http/, 'ws');
    const url = `${baseUrl}/api/v1/chat/ws/${conversationId}?token=${encodeURIComponent(token)}`;
    return url;
  }, [conversationId, token]);

  useEffect(() => {
    const url = constructWebSocketUrl();
    if (!url) {
      return;
    }
    const ws = new WebSocket(url);
    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);

        if (currentStreamRef.current) {
          const { controller } = currentStreamRef.current;
          if (data.type === 'message' && data.message) {
            if (data.message.role === 'user') {
              return;
            }
            if (data.message.role === 'assistant') {
              controller.enqueue({
                content: [{ type: 'text', text: data.message.content, additionalData: data.message.additional_data }],
              });
              currentStreamRef.current.text = data.message.content;
              controller.close();
              currentStreamRef.current = null;
            }
          } else if (data.type === 'content_delta' && data.delta) {
            const newText = currentStreamRef.current.text + data.delta;
            currentStreamRef.current.text = newText;

            controller.enqueue({
              content: [{ type: 'text', text: newText, additionalData: { delta: data.delta } }],
            });
          } else if (data.type === 'content' && data.content) {
            controller.enqueue({
              content: [{ type: 'text', text: data.content, additionalData: { content: data.content } }],
            });
            currentStreamRef.current.text = data.content;
          } else if (data.type === 'done' || data.status === 'completed') {
            controller.close();
            currentStreamRef.current = null;
          } else if (data.type === 'error' || data.error) {
            controller.error(new Error(data.error || 'Unknown error'));
            currentStreamRef.current = null;
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    ws.onerror = () => {
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    wsRef.current = ws;

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [constructWebSocketUrl]);

  const adapter: ChatModelAdapter | null =
    conversationId && token && isConnected
      ? {
          async *run({ messages, abortSignal }) {
            const ws = wsRef.current;
            if (!ws || ws.readyState !== WebSocket.OPEN) {
              throw new Error('WebSocket not connected');
            }
            const lastMessage = messages[messages.length - 1];
            if (!lastMessage || lastMessage.role !== 'user') {
              throw new Error('Last message must be from user');
            }
            const userText = lastMessage.content
              .filter((part) => part.type === 'text')
              .map((part) => ('text' in part ? part.text : ''))
              .join('\n');
            const stream = new ReadableStream({
              start: (controller) => {
                currentStreamRef.current = {
                  controller,
                  text: '',
                };
                ws.send(
                  JSON.stringify({
                    type: 'user_message',
                    content: userText,
                  }),
                );
                abortSignal?.addEventListener('abort', () => {
                  controller.close();
                  currentStreamRef.current = null;
                });
              },
            });
            const reader = stream.getReader();
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                yield value;
              }
            } finally {
              reader.releaseLock();
            }
          },
        }
      : null;

  return adapter;
};
