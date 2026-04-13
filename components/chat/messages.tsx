"use client";

import { memo, useEffect, useRef } from "react";
import type { UIMessage } from "ai";
import { MessageItem } from "./message";

// ---- Typing Indicator ----
function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0 h-8 w-8 rounded-full bg-linear-to-br from-primary to-primary/80 flex items-center justify-center overflow-hidden shadow-sm">
        <img
          src="/images/ai.png"
          alt="AI Typing"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-primary/50 animate-typing-dot"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Skeleton loader ----
function MessageSkeleton() {
  return (
    <div className="flex gap-3 w-full">
      <div className="h-8 w-8 rounded-full animate-shimmer shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-4 w-3/4 rounded-lg animate-shimmer" />
        <div className="h-4 w-1/2 rounded-lg animate-shimmer" />
      </div>
    </div>
  );
}

// ---- Error State ----
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
      <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
        <span className="text-lg">⚠️</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-destructive">Something went wrong</p>
        <p className="text-muted-foreground text-xs mt-0.5">
          The AI couldn&apos;t respond. Please try again.
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="shrink-0 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive px-3 py-1.5 text-xs font-medium transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

// ---- Overview (Welcome Screen) ----
function Overview() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-message-in">
      <div className="relative mb-6">
        <div className="absolute -inset-1 rounded-full bg-linear-to-tr from-primary to-primary/30 blur-sm opacity-50" />
        <div className="relative h-20 w-20 rounded-full bg-linear-to-br from-primary to-primary/80 flex items-center justify-center overflow-hidden shadow-xl ring-4 ring-background">
          <img
            src="/images/ai.png"
            alt="Friendly AI Logo"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-3">
        How can I help you today?
      </h1>
      <p className="max-w-md text-muted-foreground leading-relaxed mb-10">
        I&apos;m your Friendly AI Assistant, powered by Groq & Llama 3.3. 
        Ask me anything from coding help to creative writing!
      </p>

    </div>
  );
}

// ---- Messages List ----
interface MessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  error: Error | null;
  onRetry: () => void;
}

function PureMessageList({
  messages,
  isLoading,
  isStreaming,
  error,
  onRetry,
}: MessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages / streaming
  useEffect(() => {
    const el = messagesEndRef.current;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: intentional triggers for scrolling
  }, [messages.length, isStreaming]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 pt-6 pb-4"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        {/* Welcome Screen */}
        {messages.length === 0 && !isLoading && (
          <Overview />
        )}

        {/* Loading skeletons (initial load) */}
        {messages.length === 0 && isLoading && (
          <>
            <MessageSkeleton />
            <MessageSkeleton />
          </>
        )}

        {/* Actual messages */}
        {messages.map((message, index) => (
          <MessageItem
            key={message.id ?? index}
            message={message}
            isLast={index === messages.length - 1}
          />
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <TypingIndicator />
        )}

        {/* Error state */}
        {error && !isLoading && (
          <ErrorState onRetry={onRetry} />
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} className="h-1" />
      </div>
    </div>
  );
}

export const MessageList = memo(PureMessageList);
