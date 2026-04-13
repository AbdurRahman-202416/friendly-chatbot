"use client";

import Image from "next/image";

import { memo, useCallback } from "react";
import { PanelLeftIcon, Trash2Icon, BotIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useActiveChat } from "@/hooks/use-active-chat";
import { useChatStore } from "@/store/chat-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function PureChatHeader() {
  const { toggleSidebar } = useSidebar();
  const { clearMessages } = useActiveChat();
  const { activeChatId, sessions } = useChatStore();

  const activeSession = sessions.find((s) => s.id === activeChatId);

  const handleClear = useCallback(() => {
    clearMessages();
    toast.success("Chat cleared");
  }, [clearMessages]);

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-14 items-center gap-3 px-4",
        "border-b border-border bg-background/80 backdrop-blur-sm"
      )}
    >
      {/* Sidebar toggle */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={toggleSidebar}
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Toggle sidebar"
          >
            <PanelLeftIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Toggle sidebar</TooltipContent>
      </Tooltip>

      {/* Brand / session title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary flex-shrink-0 overflow-hidden border border-border relative">
          <Image
            src="/images/project-icon.png"
            alt="AI Logo"
            fill
            sizes="28px"
            className="object-cover"
            priority
          />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-semibold truncate text-foreground">
            {activeSession?.title ?? "Friendly Chatbot"}
          </h1>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Status dot */}
        <div className="hidden sm:flex items-center gap-1.5 mr-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
            Live
          </span>
        </div>

        {/* Clear chat */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleClear}
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              aria-label="Clear chat"
            >
              <Trash2Icon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Clear chat</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader);
