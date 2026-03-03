import { useState, useEffect, useRef } from 'react';
import {
  ThreadPrimitive,
  MessagePrimitive,
  ComposerPrimitive,
  useThreadRuntime,
  useMessageRuntime,
} from '@assistant-ui/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';

const TypingLoader = () => (
  <div className="typing-loader">
    <span className="typing-dot" />
    <span className="typing-dot" />
    <span className="typing-dot" />
  </div>
);

const MarkdownContent = ({ text }: { text: string }) => (
  <div className="markdown-content">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
  </div>
);

const Attachment = ({
  id,
  name,
  size,
  type,
  onAttachmentClick,
}: {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'image';
  downloadUrl?: string;
  onAttachmentClick: (id: string) => void;
}) => (
  <div className="message-attachment" onClick={() => onAttachmentClick(id)}>
    <div className={`attachment-icon attachment-icon-${type}`}>
      {type === 'pdf' ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      )}
    </div>
    <div className="attachment-info">
      <div className="attachment-name">{name}</div>
      <div className="attachment-size">{size}</div>
    </div>
  </div>
);

const UserMessage = () => (
  <MessagePrimitive.Root className="thread-message">
    <div className="message-content message-user message-fade-in">
      <MessagePrimitive.Content />
    </div>
  </MessagePrimitive.Root>
);

const AssistantMessage = () => {
  const runtime = useMessageRuntime();
  const navigate = useNavigate();
  const initialState = runtime.getState();
  const [messageState, setMessageState] = useState(initialState);
  const [isTyping, setIsTyping] = useState(false);
  const [displayContent, setDisplayContent] = useState<typeof messageState.content>(
    initialState.content.length > 0 ? initialState.content : [],
  );
  const typingTimerRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const updateState = () => {
      const newState = runtime.getState();
      setMessageState(newState);
      if (newState.content.length > 0 && displayContent.length === 0 && !isInitialMount.current) {
        setIsTyping(true);
        if (typingTimerRef.current) {
          clearTimeout(typingTimerRef.current);
        }
        typingTimerRef.current = window.setTimeout(() => {
          setIsTyping(false);
          setDisplayContent(newState.content);
        }, 800);
      } else if (newState.content.length > 0 && displayContent.length === 0 && isInitialMount.current) {
        setDisplayContent(newState.content);
      } else if (newState.content.length > 0) {
        setDisplayContent(newState.content);
      }
    };
    const unsubscribe = runtime.subscribe(updateState);
    isInitialMount.current = false;
    return () => {
      unsubscribe();
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [runtime, displayContent.length]);

  const handleAttachmentClick = (id: string) => {
    navigate(`/document/${id}`);
  };

  const { status } = messageState;
  const hasNoContent = displayContent.length === 0;
  const showLoader = isTyping || hasNoContent || status?.type === 'incomplete' || status?.type === undefined;
  return (
    <MessagePrimitive.Root className="thread-message">
      <div className="message-content message-assistant">
        {showLoader ? (
          <TypingLoader />
        ) : (
          <div className="message-fade-in">
            {displayContent.map((part, i) =>
              part.type === 'text' ? <MarkdownContent key={i} text={part.text as string} /> : null,
            )}
          </div>
        )}
      </div>
      <div className="message-attachments">
        {displayContent.map((part, i) => {
          const files = (part as unknown).additionalData?.files;
          return Array.isArray(files)
            ? files.map(
                (
                  file: { id: string; filename: string; file_size: number; content_type: string; downloadUrl: string },
                  j: number,
                ) => (
                  <Attachment
                    key={`${i}-${j}`}
                    id={file.id}
                    name={file.filename}
                    size={`${(file.file_size / 1024).toFixed(1)} KB`}
                    type={file.content_type.startsWith('image/') ? 'image' : 'pdf'}
                    downloadUrl={file.downloadUrl}
                    onAttachmentClick={handleAttachmentClick}
                  />
                ),
              )
            : null;
        })}
      </div>
    </MessagePrimitive.Root>
  );
};

const Composer = () => {
  const runtime = useThreadRuntime();
  const [threadState, setThreadState] = useState(runtime.getState());
  useEffect(() => {
    const updateState = () => {
      setThreadState(runtime.getState());
    };

    const unsubscribe = runtime.subscribe(updateState);
    return unsubscribe;
  }, [runtime]);

  const { isRunning } = threadState;

  return (
    <ComposerPrimitive.Root className="thread-composer">
      <div className="thread-composer-wrapper">
        <ComposerPrimitive.Input
          className="thread-composer-input"
          placeholder="Wpisz wiadomość..."
          autoFocus
          rows={1}
          disabled={isRunning}
        />
        <ComposerPrimitive.Send className="thread-composer-send" disabled={isRunning}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  );
};

export const ThreadView = () => {
  const viewportRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const scrollToBottom = () => {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: 'smooth',
      });
    };
    const observer = new MutationObserver(() => {
      scrollToBottom();
    });
    observer.observe(viewport, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    scrollToBottom();
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <ThreadPrimitive.Root className="thread-root">
      <ThreadPrimitive.Viewport className="thread-viewport" ref={viewportRef as React.RefObject<HTMLDivElement>}>
        <ThreadPrimitive.If empty={false}>
          <ThreadPrimitive.Messages
            components={{
              UserMessage,
              AssistantMessage,
            }}
          />
        </ThreadPrimitive.If>
        <ThreadPrimitive.If empty={true}>
          <div className="thread-empty">
            <span className="thread-empty-text">Witaj!</span>
            <span className="thread-empty-subtext">Jak mogę Ci dzisiaj pomóc?</span>
          </div>
        </ThreadPrimitive.If>
      </ThreadPrimitive.Viewport>
      <Composer />
    </ThreadPrimitive.Root>
  );
};
