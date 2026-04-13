"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { ArrowUpIcon, Sparkles, SquareIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  sendMessage: (text?: string) => void;
  stop: () => void;
}

const MAX_ROWS = 8;

function PureChatInput({
  input,
  setInput,
  isLoading,
  sendMessage,
  stop,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Listen for suggested prompt events from the welcome screen
  useEffect(() => {
    const handler = (e: Event) => {
      const { text } = (e as CustomEvent<{ text: string }>).detail;
      setInput(text);
      textareaRef.current?.focus();
    };
    window.addEventListener("chatbot:suggest", handler);
    return () => window.removeEventListener("chatbot:suggest", handler);
  }, [setInput]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const lineH = getComputedStyle(ta).lineHeight;
    const maxH = parseInt(lineH === "normal" ? "20" : lineH, 10) * MAX_ROWS;
    ta.style.height = `${Math.min(ta.scrollHeight, maxH)}px`;
    // biome-ignore lint/correctness/useExhaustiveDependencies: auto-resize on input change
  }, [input]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (isLoading) {
          stop();
        } else if (input.trim()) {
          sendMessage();
        }
      }
    },
    [input, isLoading, sendMessage, stop]
  );

  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 pt-2">
      <div
        className={cn(
          "relative flex items-end gap-2 rounded-2xl border border-border bg-card shadow-sm",
          "transition-all duration-200",
          "focus-within:border-primary/40 focus-within:shadow-md focus-within:shadow-primary/5 focus-within:ring-1 focus-within:ring-primary/10",
          isLoading && "border-primary/30"
        )}
      >
        {/* AI indicator dot */}
        <div className="flex-shrink-0 flex items-center justify-center w-10 pb-[13px] pl-1">
          <Sparkles
            className={cn(
              "h-4 w-4 transition-colors duration-300",
              isLoading ? "text-primary animate-pulse" : "text-muted-foreground/40"
            )}
          />
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id="chat-input"
          placeholder={isLoading ? "AI is responding..." : "Message Friendly Chatbot…"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={false} // Keep enabled so user can type next message
          rows={1}
          className={cn(
            "flex-1 resize-none bg-transparent py-3.5 text-sm leading-relaxed text-foreground",
            "placeholder:text-muted-foreground/60",
            "focus:outline-none",
            "min-h-[52px]",
            "max-h-60",
            "scrollbar-thin"
          )}
          aria-label="Message input"
          aria-multiline="true"
        />

        {/* Send / Stop button */}
        <div className="flex-shrink-0 pb-2 pr-2">
          <button
            type="button"
            onClick={isLoading ? stop : () => sendMessage()}
            disabled={!canSend && !isLoading}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl",
              "transition-all duration-150",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              isLoading
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : canSend
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm shadow-primary/20"
                : "bg-muted text-muted-foreground/40 cursor-not-allowed"
            )}
            aria-label={isLoading ? "Stop generation" : "Send message"}
            title={
              isLoading
                ? "Stop (Enter)"
                : canSend
                ? "Send (Enter)"
                : "Type a message"
            }
          >
            {isLoading ? (
              <SquareIcon className="h-3.5 w-3.5 fill-current" />
            ) : (
              <ArrowUpIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Footer hint */}
      <p className="text-center text-[11px] text-muted-foreground/50 mt-2">
        Press{" "}
        <kbd className="rounded bg-muted border border-border px-1 py-0.5 font-mono text-[10px]">
          Enter
        </kbd>{" "}
        to send,{" "}
        <kbd className="rounded bg-muted border border-border px-1 py-0.5 font-mono text-[10px]">
          Shift+Enter
        </kbd>{" "}
        for newline
      </p>
    </div>
  );
}

export const ChatInput = memo(PureChatInput);
