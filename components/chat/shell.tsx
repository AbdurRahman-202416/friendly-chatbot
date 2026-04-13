"use client";

import { memo } from "react";
import { useActiveChat } from "@/hooks/use-active-chat";
import { ChatHeader } from "./chat-header";
import { MessageList } from "./messages";
import { ChatInput } from "./multimodal-input";

function PureChatShell() {
  const {
    messages,
    sendMessage,
    status,
    stop,
    input,
    setInput,
    isLoading,
    isStreaming,
    error,
    retry,
  } = useActiveChat();

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#f8f9fc]">
      <ChatHeader />

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          isStreaming={isStreaming}
          error={error}
          onRetry={retry}
        />

        <ChatInput
          input={input}
          setInput={setInput}
          isLoading={status === "streaming" || status === "submitted"}
          sendMessage={sendMessage}
          stop={stop}
        />
      </div>
    </div>
  );
}

export const ChatShell = memo(PureChatShell);
