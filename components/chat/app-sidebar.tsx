"use client";

import { memo, useCallback } from "react";
import { BotIcon, MessageSquareIcon, PenSquareIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn, formatChatTime } from "@/lib/utils";
import { useChatStore, type ChatSession } from "@/store/chat-store";

// ---- New Chat Button ----
function NewChatButton() {
  const { createSession } = useChatStore();
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenuButton
      className={cn(
        "h-9 rounded-lg font-medium text-sm",
        "flex items-center gap-2",
        "border border-sidebar-border",
        "text-sidebar-foreground hover:bg-sidebar-accent transition-colors duration-150"
      )}
      onClick={() => {
        setOpenMobile(false);
        createSession();
      }}
      tooltip="New Chat"
    >
      <PenSquareIcon className="size-4 flex-shrink-0" />
      <span>New chat</span>
    </SidebarMenuButton>
  );
}

// ---- Session Item ----
interface SessionItemProps {
  session: ChatSession;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

function PureSessionItem({
  session,
  isActive,
  onSelect,
  onDelete,
}: SessionItemProps) {
  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete(session.id);
    },
    [onDelete, session.id]
  );

  const handleDeleteKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        onDelete(session.id);
      }
    },
    [onDelete, session.id]
  );

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={isActive}
        onClick={() => onSelect(session.id)}
        className="h-12"
        tooltip={session.title}
      >
        <MessageSquareIcon
          className={cn(
            "h-4 w-4 flex-shrink-0",
            isActive ? "text-primary" : "text-muted-foreground"
          )}
        />
        <div className="flex-1 min-w-0">
          <p className="truncate text-xs font-medium leading-tight text-sidebar-foreground">
            {session.title}
          </p>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5">
            {formatChatTime(session.updatedAt)}
          </p>
        </div>
      </SidebarMenuButton>

      <SidebarMenuAction
        onClick={handleDelete}
        onKeyDown={handleDeleteKeyDown}
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        title="Delete chat"
        aria-label={`Delete chat: ${session.title}`}
      >
        <Trash2Icon className="h-3.5 w-3.5" />
      </SidebarMenuAction>
    </SidebarMenuItem>
  );
}

const SessionItem = memo(PureSessionItem);

// ---- Main Sidebar ----
function PureAppSidebar() {
  const { setOpenMobile } = useSidebar();
  const { sessions, activeChatId, setActiveChatId, deleteSession } =
    useChatStore();

  const handleSelectSession = useCallback(
    (id: string) => {
      setActiveChatId(id);
      setOpenMobile(false);
    },
    [setActiveChatId, setOpenMobile]
  );

  const handleDeleteSession = useCallback(
    (id: string) => {
      deleteSession(id);
      toast.success("Chat deleted");
    },
    [deleteSession]
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Header */}
      <SidebarHeader className="pb-0 pt-3">
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row items-center justify-between">
            {/* Logo area */}
            <div className="flex items-center justify-center">
              <SidebarMenuButton
                asChild
                className="size-8 !px-0 items-center justify-center"
                tooltip="Friendly Chatbot"
              >
                <Link href="/" onClick={() => setOpenMobile(false)}>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg ">
                    <svg
                      width="120"
                      height="120"
                      viewBox="0 0 120 120"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        {/* Metallic body */}
                        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#e2e8f0" />
                          <stop offset="50%" stopColor="#cbd5f5" />
                          <stop offset="100%" stopColor="#94a3b8" />
                        </linearGradient>

                        {/* Glow */}
                        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#065f46" />
                        </radialGradient>
                      </defs>

                      {/* Head */}
                      <rect x="15" y="10" width="90" height="70" rx="20" fill="url(#metal)" />

                      {/* Face screen */}
                      <rect x="25" y="20" width="70" height="50" rx="15" fill="#020617" />

                      {/* Eyes */}
                      <circle cx="45" cy="45" r="6" fill="url(#eyeGlow)" />
                      <circle cx="75" cy="45" r="6" fill="url(#eyeGlow)" />

                      {/* Smile */}
                      <path
                        d="M45 58 Q60 68 75 58"
                        stroke="#34d399"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                      />

                      {/* Antenna */}
                      <line x1="60" y1="5" x2="60" y2="10" stroke="#94a3b8" strokeWidth="2" />
                      <circle cx="60" cy="4" r="3" fill="#34d399" />

                      {/* Body */}
                      <rect x="30" y="80" width="60" height="25" rx="10" fill="url(#metal)" />

                      {/* Core light */}
                      <circle cx="60" cy="92" r="5" fill="url(#eyeGlow)" />
                    </svg>
                  </div>
                </Link>
              </SidebarMenuButton>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="overflow-hidden">
        {/* New Chat button */}
        <SidebarMenu className="px-2 pt-2">
          <SidebarMenuItem>
            <NewChatButton />
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Chat history */}
        {sessions.length > 0 && (
          <div className="group-data-[collapsible=icon]:hidden flex-1 overflow-hidden">
            <div className="px-3 pb-1 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                Recent
              </p>
            </div>
            <div className="px-1 overflow-y-auto max-h-[calc(100vh-200px)]">
              <SidebarMenu>
                {sessions.map((session) => (
                  <SessionItem
                    key={session.id}
                    session={session}
                    isActive={session.id === activeChatId}
                    onSelect={handleSelectSession}
                    onDelete={handleDeleteSession}
                  />
                ))}
              </SidebarMenu>
            </div>
          </div>
        )}

        {sessions.length === 0 && (
          <div className="group-data-[collapsible=icon]:hidden px-4 py-6 text-center">
            <p className="text-xs text-muted-foreground/50">
              No conversations yet. Start a new chat!
            </p>
          </div>
        )}
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <div className="flex items-center group-data-[collapsible=icon]:justify-center">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
              AI Online
            </span>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export const AppSidebar = memo(PureAppSidebar);

