"use client";

import { useChat } from "@ai-sdk/react";
import { getTitleFromMessage, getTextFromMessage } from "@/lib/utils";
import { useChatStore } from "@/store/chat-store";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type ActiveChatContextValue = {
  messages: UIMessage[];
  setMessages: (messages: UIMessage[]) => void;
  sendMessage: (text?: string) => void;
  status: string;
  stop: () => void;
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  isStreaming: boolean;
  error: Error | null;
  retry: () => void;
  clearMessages: () => void;
};

const ActiveChatContext = createContext<ActiveChatContextValue | null>(null);

/** Load persisted messages from localStorage */
function loadMessages(id: string): UIMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`chat-msgs-${id}`);
    return raw ? (JSON.parse(raw) as UIMessage[]) : [];
  } catch {
    return [];
  }
}

/** Save messages to localStorage */
function saveMessages(id: string, messages: UIMessage[]) {
  if (typeof window === "undefined") return;
  try {
    if (messages.length === 0) {
      localStorage.removeItem(`chat-msgs-${id}`);
    } else {
      localStorage.setItem(`chat-msgs-${id}`, JSON.stringify(messages));
    }
  } catch {
    /* quota exceeded */
  }
}

// Use a stable default so chat ID is always defined
const DEFAULT_CHAT_ID = "default-chat";

export function ActiveChatProvider({ children }: { children: ReactNode }) {
  const [input, setInput] = useState("");
  const { activeChatId, createSession, setActiveChatId, updateSession, sessions } =
    useChatStore();
  const lastUserMsgRef = useRef<string>("");
  const isInitializingRef = useRef(false);

  // The chat id we'll use with useChat — always a string
  const chatId = activeChatId ?? DEFAULT_CHAT_ID;

  const {
    messages,
    setMessages,
    sendMessage: sdkSendMessage,
    status,
    stop,
    error,
    regenerate,
  } = useChat({
    id: chatId,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const lastSavedCountRef = useRef(0);

  // Auto-save messages to localStorage whenever they change
  useEffect(() => {
    if (activeChatId && messages.length > 0) {
      saveMessages(activeChatId, messages);
      
      const currentSession = sessions.find(s => s.id === activeChatId);
      const hasTitle = currentSession && currentSession.title !== "New Chat";
      
      // Update session message count and title if needed
      if (!hasTitle) {
        const lastUserMessage = messages.findLast(m => m.role === 'user');
        const lastUserMsg = lastUserMessage ? getTextFromMessage(lastUserMessage) : undefined;
        if (lastUserMsg) {
          updateSession(activeChatId, {
            title: getTitleFromMessage(lastUserMsg),
            messageCount: messages.length,
          });
          lastSavedCountRef.current = messages.length;
        }
      } else if (currentSession && currentSession.messageCount !== messages.length) {
        // Only update if count actually changed to avoid render loop
        updateSession(activeChatId, { messageCount: messages.length });
        lastSavedCountRef.current = messages.length;
      }
    }
  }, [messages.length, activeChatId, updateSession, sessions]);

  // Restore messages when the active session changes
  useEffect(() => {
    if (!activeChatId) {
      if (!isInitializingRef.current) {
        isInitializingRef.current = true;
        // Use store.getState() or similar if we wanted absolute latest sessions without dependency
        // but for initialization, checking it once is fine.
        if (sessions.length > 0) {
          setActiveChatId(sessions[0].id);
        } else {
          createSession();
        }
      }
      return;
    }

    const saved = loadMessages(activeChatId);
    setMessages(saved);
    lastSavedCountRef.current = saved.length;
  }, [activeChatId, setMessages]); // Removed sessions, setActiveChatId, createSession as dependencies

  const sendMessage = useCallback(
    async (text?: string) => {
      const msg = text ?? input;
      if (!msg.trim()) return;

      lastUserMsgRef.current = msg;
      if (!text) setInput("");

      await sdkSendMessage({ text: msg });
    },
    [input, sdkSendMessage]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    if (activeChatId) saveMessages(activeChatId, []);
  }, [setMessages, activeChatId]);

  const value = useMemo<ActiveChatContextValue>(
    () => ({
      messages,
      setMessages,
      sendMessage,
      status,
      stop,
      input,
      setInput,
      isLoading: status === "streaming" || status === "submitted",
      isStreaming: status === "streaming",
      error: error ?? null,
      retry: regenerate,
      clearMessages,
    }),
    [
      messages,
      setMessages,
      sendMessage,
      status,
      stop,
      input,
      error,
      regenerate,
      clearMessages,
    ]
  );

  return (
    <ActiveChatContext.Provider value={value}>
      {children}
    </ActiveChatContext.Provider>
  );
}

export function useActiveChat() {
  const context = useContext(ActiveChatContext);
  if (!context) {
    throw new Error("useActiveChat must be used within ActiveChatProvider");
  }
  return context;
}
