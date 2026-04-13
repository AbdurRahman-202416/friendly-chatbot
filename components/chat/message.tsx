"use client";

import { memo, useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { BotIcon, CheckIcon, CopyIcon, UserIcon } from "lucide-react";
import { toast } from "sonner";
import { cn, getTextFromMessage } from "@/lib/utils";
import type { UIMessage } from "ai";

interface MessageItemProps {
  message: UIMessage;
  isLast?: boolean;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium",
        "transition-all duration-150",
        "text-muted-foreground hover:text-foreground",
        "hover:bg-accent",
        "opacity-0 group-hover:opacity-100 focus:opacity-100"
      )}
      title="Copy message"
    >
      {copied ? (
        <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <CopyIcon className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const [copied, setCopied] = useState(false);

  // Extract language from className (e.g., "language-typescript")
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";

  const codeText =
    typeof children === "string"
      ? children
      : Array.isArray(children)
      ? children.join("")
      : "";

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }, [codeText]);

  return (
    <div className="relative group/code my-3 rounded-xl overflow-hidden border border-[#334155] bg-[#1e293b]">
      {/* Code block header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e293b] border-b border-[#334155]">
        <span className="text-[11px] font-mono font-medium text-[#94a3b8] uppercase tracking-wider">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-[#94a3b8] hover:text-[#e2e8f0] transition-colors"
        >
          {copied ? (
            <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
          ) : (
            <CopyIcon className="h-3.5 w-3.5" />
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <code
        className={cn(className, "block overflow-x-auto px-4 py-4 text-sm text-[#e2e8f0]")}
        {...props}
      >
        {children}
      </code>
    </div>
  );
}

function extractTextContent(message: UIMessage): string {
  return getTextFromMessage(message);
}

function PureMessageItem({ message }: MessageItemProps) {
  const isUser = message.role === "user";
  const textContent = extractTextContent(message);

  return (
    <div
      className={cn(
        "group flex w-full gap-3 animate-message-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full mt-0.5 overflow-hidden",
          isUser
            ? "bg-muted ring-1 ring-border"
            : "bg-gradient-to-br from-primary to-primary/80 shadow-sm shadow-primary/20"
        )}
      >
        {isUser ? (
          <img
            src="/images/man.png"
            alt="User"
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src="/images/ai.png"
            alt="AI"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "relative flex flex-col max-w-[82%] min-w-0",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm shadow-sm shadow-primary/20"
              : "bg-card text-foreground border border-border rounded-tl-sm shadow-sm"
          )}
        >
          {isUser ? (
            <span className="whitespace-pre-wrap break-words">
              {textContent}
            </span>
          ) : (
            <div className="prose-chat text-foreground">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  // Override code blocks with our custom component
                  pre: ({ children }) => <>{children}</>,
                  code: ({ className, children, ...props }) => {
                    const isBlock = /language-/.test(className || "");
                    if (isBlock) {
                      return (
                        <CodeBlock className={className} {...props}>
                          {children}
                        </CodeBlock>
                      );
                    }
                    return (
                      <code
                        className={cn(
                          "bg-muted text-primary px-1.5 py-0.5 rounded text-[0.85em] font-mono",
                          className
                        )}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {textContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Copy button — shown on hover */}
        {textContent && (
          <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <CopyButton text={textContent} />
          </div>
        )}
      </div>
    </div>
  );
}

export const MessageItem = memo(PureMessageItem);
