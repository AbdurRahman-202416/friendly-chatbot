import type { Metadata } from "next";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/chat/app-sidebar";
import { ChatShell } from "@/components/chat/shell";
import { ActiveChatProvider } from "@/hooks/use-active-chat";

export const metadata: Metadata = {
  title: "Friendly Chatbot — AI Assistant",
  description: "Chat with an AI assistant. Ask anything, get instant answers.",
};

export default function Page() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <ActiveChatProvider>
          <ChatShell />
        </ActiveChatProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
