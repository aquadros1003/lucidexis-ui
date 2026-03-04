import { useState, useRef, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AssistantRuntimeProvider, useLocalRuntime, type ThreadMessage } from '@assistant-ui/react';
import { useWebSocketRuntime } from './useWebSocketRuntime';
import { ThreadView } from './ThreadView';
import { useAuthContext } from '../../contexts';
import { getLatestConversation, getConversationMessages, startNewConversation } from '../../api/hooks/chat';
import type { ChatMessage } from '../../api/schema/chat';
import './AssistantModal.scss';
import { useTranslation } from 'react-i18next';
import { ThreadIcon, TrashIcon } from '../../assets/icons';
import { toast } from 'sonner';

interface AssistantModalProps {
  conversationId?: string;
  trigger?: React.ReactNode;
}

const mapMessagesToThreadMessages = (messages: ChatMessage[]): ThreadMessage[] => {
  return messages.map((msg) => {
    const base = {
      id: msg.id,
      role: msg.role,
      content: [{ type: 'text' as const, text: msg.content, additionalData: msg.additional_data }],
      createdAt: new Date(msg.created_at),
      metadata: {
        custom: {},
      },
    };

    if (msg.role === 'assistant') {
      return {
        ...base,
        role: 'assistant' as const,
        status: { type: 'complete' as const },
      };
    } else {
      return {
        ...base,
        role: 'user' as const,
        attachments: [],
      };
    }
  }) as ThreadMessage[];
};

export const AssistantModal = ({ trigger }: AssistantModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const [modalPosition, setModalPosition] = useState({ bottom: 0, right: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { token, isAuthenticated } = useAuthContext();
  const queryClient = useQueryClient();
  const {
    data: conversationData,
    isLoading: isLoadingConversation,
    isError: isConversationError,
  } = useQuery({
    queryKey: ['conversation', 'latest'],
    queryFn: getLatestConversation,
    enabled: !!token && isAuthenticated,
    staleTime: Infinity,
  });
  const { mutate: clearConversation, isPending: isClearingConversation } = useMutation({
    mutationFn: startNewConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', 'latest'] });
      queryClient.invalidateQueries({ queryKey: ['conversation-messages'] });
    },
    onError: () => {
      toast.error(t('common:errors.somethingWentWrong'));
    },
  });
  const conversationId = conversationData?.conversation?.id;
  const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['conversation-messages', conversationId],
    queryFn: () => {
      return getConversationMessages(conversationId!);
    },
    enabled: !!conversationId,
    staleTime: Infinity,
  });
  const adapter = useWebSocketRuntime(conversationId, token || undefined);
  const isLoading = isLoadingConversation || isLoadingMessages;

  const initialMessages = useMemo(
    () => mapMessagesToThreadMessages(messagesData?.messages || []),
    [messagesData?.messages],
  );

  const runtime = useLocalRuntime(adapter || { async *run() {} }, { initialMessages });
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setModalPosition({
        bottom: window.innerHeight - rect.top + 10,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);
  if (!isAuthenticated || !token) {
    return null;
  }
  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen((prev) => !prev)}>{trigger}</div>
      ) : (
        <button ref={triggerRef} className="assistant-modal-trigger" onClick={() => setIsOpen((prev) => !prev)}>
          <ThreadIcon width="20" height="20" />
          <span>LuciAI</span>
        </button>
      )}
      {isOpen && (
        <div className="assistant-modal-overlay" onClick={() => setIsOpen(false)} data-assistant-modal-overlay>
          <div
            className="assistant-modal-content"
            onClick={(e) => e.stopPropagation()}
            data-assistant-modal-content
            style={{
              position: 'fixed',
              bottom: `${modalPosition.bottom}px`,
              right: `${modalPosition.right}px`,
            }}
          >
            <div className="assistant-modal-header">
              <h2>🤖 LuciAI</h2>
              <button
                className="assistant-modal-clear"
                onClick={() => clearConversation()}
                aria-label="Clear conversation"
                disabled={isClearingConversation}
              >
                <TrashIcon width="20" height="20" />
              </button>
            </div>
            <div className="assistant-modal-body">
              {isLoading ? (
                <div className="thread-empty">
                  <p>{t('assistantModal.loading')}</p>
                </div>
              ) : isConversationError ? (
                <div className="thread-empty">
                  <p>{t('assistantModal.error')}</p>
                </div>
              ) : !conversationId ? (
                <div className="thread-empty">
                  <p>{t('assistantModal.noConversation')}</p>
                </div>
              ) : !adapter ? (
                <div className="thread-empty">
                  <p>{t('assistantModal.noConnection')}</p>
                </div>
              ) : (
                <AssistantRuntimeProvider runtime={runtime}>
                  <ThreadView />
                </AssistantRuntimeProvider>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
