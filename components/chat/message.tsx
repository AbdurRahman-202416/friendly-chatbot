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
        "sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100"
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

  // Recursively extract text from children for copying
  const extractText = (node: any): string => {
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (node?.props?.children) return extractText(node.props.children);
    return "";
  };

  const codeText = extractText(children);

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
    <div className="relative group/code my-3 sm:my-4 rounded-xl overflow-hidden border border-border/50 bg-[#0d1117] shadow-lg max-w-[calc(100vw-6rem)] sm:max-w-full">
      {/* Code block header */}
      <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 bg-[#161b22] border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/80" />
          </div>
          <span className="sm:ml-2 text-[10px] sm:text-[11px] font-mono font-medium text-muted-foreground uppercase tracking-widest">
            {language || "code"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
        >
          {copied ? (
            <CheckIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-500" />
          ) : (
            <CopyIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto">
        <code
          className={cn(
            className,
            "hljs block px-3 py-3 sm:px-4 sm:py-4 text-[12px] sm:text-[13px] leading-relaxed font-mono whitespace-pre"
          )}
          {...props}
        >
          {children}
        </code>
      </pre>
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
        "group flex w-full gap-2 sm:gap-3 animate-message-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 flex h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 items-center justify-center rounded-full mt-1 overflow-hidden",
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

      {/* Bubble Container */}
      <div
        className={cn(
          "relative flex flex-col min-w-0",
          isUser
            ? "items-end max-w-[85%] sm:max-w-[80%] md:max-w-[80%] lg:max-w-[75%]"
            : "items-start max-w-[85%] sm:max-w-[80%] md:max-w-[80%] lg:max-w-[75%]"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-3 py-2 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3 text-[13px] sm:text-sm leading-relaxed",
            "max-w-full overflow-hidden",
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
            <div className="prose-chat text-foreground overflow-hidden">
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
                  // Wrap tables for horizontal scroll on mobile
                  table: ({ children, ...props }) => (
                    <div className="overflow-x-auto -mx-3 px-3 sm:-mx-3.5 sm:px-3.5 md:-mx-4 md:px-4">
                      <table {...props}>{children}</table>
                    </div>
                  ),
                }}
              >
                {textContent}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Copy button — visible on mobile, hover on desktop */}
        {textContent && (
          <div className="mt-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-150">
            <CopyButton text={textContent} />
          </div>
        )}
      </div>
    </div>
  );
}

export const MessageItem = memo(PureMessageItem);
