"use client";

import Image from "next/image";

import { memo, useCallback } from "react";
import { PanelLeftIcon, Trash2Icon, BotIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useActiveChat } from "@/hooks/use-active-chat";
import { useChatStore } from "@/store/chat-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function PureChatHeader() {
  const { toggleSidebar } = useSidebar();
  const { clearMessages, messages } = useActiveChat();
  const { activeChatId, sessions } = useChatStore();

  const activeSession = sessions.find((s) => s.id === activeChatId);

  const handleClear = useCallback(() => {
    if (messages.length > 0) {
      clearMessages();
      toast.success("Current Chat cleared");
    } else {
      toast.info("Nothing to clear here!");
    }
  }, [clearMessages, messages.length]);
  const handleLiveClick = useCallback(() => {
    toast.info("Friendly Chatbot is active now!");
  }, []);
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

        {/* Icon */}
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0f172a] flex-shrink-0 overflow-hidden border border-blue-900/30">
          <svg width="20" height="20" viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </radialGradient>
            </defs>

            {/* Head */}
            <rect x="42" y="12" rx="28" width="136" height="96" fill="url(#metal)" />
            {/* Face screen */}
            <rect x="56" y="26" rx="20" width="108" height="68" fill="#020617" />
            {/* Eyes */}
            <circle cx="88" cy="58" r="11" fill="url(#glow)" />
            <circle cx="132" cy="58" r="11" fill="url(#glow)" />
            <circle cx="88" cy="58" r="4" fill="#bfdbfe" />
            <circle cx="132" cy="58" r="4" fill="#bfdbfe" />
            {/* Smile */}
            <path d="M86 78 Q110 93 134 78" stroke="#38bdf8" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            {/* Body */}
            <rect x="58" y="108" rx="18" width="104" height="88" fill="url(#metal)" />
            {/* Core */}
            <circle cx="110" cy="152" r="14" fill="url(#glow)" />
            <circle cx="110" cy="152" r="5" fill="#bfdbfe" />
            {/* Arms */}
            <rect x="18" y="118" rx="10" width="32" height="66" fill="url(#metal)" />
            <rect x="170" y="118" rx="10" width="32" height="66" fill="url(#metal)" />
            {/* Legs */}
            <rect x="68" y="196" rx="9" width="26" height="48" fill="url(#metal)" />
            <rect x="126" y="196" rx="9" width="26" height="48" fill="url(#metal)" />
            {/* Feet */}
            <ellipse cx="81" cy="247" rx="22" ry="8" fill="#475569" />
            <ellipse cx="139" cy="247" rx="22" ry="8" fill="#475569" />
          </svg>
        </div>

        {/* Title + status */}
        <div className="flex items-center gap-1.5 min-w-0">
          <h1 className="text-sm font-semibold truncate text-foreground">
            Friendly Chatbot
          </h1>

        </div>

      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Status dot */}
        <div onClick={() => handleLiveClick()} className="hidden sm:flex items-center gap-1.5 mr-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
            Active
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
