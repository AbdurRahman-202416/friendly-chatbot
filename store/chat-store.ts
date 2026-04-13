import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "@/lib/utils";

export type ChatSession = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
};

type ChatStoreState = {
  sessions: ChatSession[];
  activeChatId: string | null;

  // Actions
  createSession: () => string;
  updateSession: (id: string, patch: Partial<ChatSession>) => void;
  deleteSession: (id: string) => void;
  setActiveChatId: (id: string | null) => void;
};

export const useChatStore = create<ChatStoreState>()(
  persist(
    (set, get) => ({
      sessions: [],
      activeChatId: null,

      createSession: () => {
        const id = nanoid();
        const now = Date.now();
        const session: ChatSession = {
          id,
          title: "New Chat",
          createdAt: now,
          updatedAt: now,
          messageCount: 0,
        };
        set((state) => ({
          sessions: [session, ...state.sessions],
          activeChatId: id,
        }));
        return id;
      },

      updateSession: (id, patch) => {
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === id ? { ...s, ...patch, updatedAt: Date.now() } : s
          ),
        }));
      },

      deleteSession: (id) => {
        const { sessions, activeChatId } = get();
        const remaining = sessions.filter((s) => s.id !== id);
        const newActive =
          activeChatId === id
            ? remaining.length > 0
              ? remaining[0].id
              : null
            : activeChatId;
        set({ sessions: remaining, activeChatId: newActive });
      },

      setActiveChatId: (id) => set({ activeChatId: id }),
    }),
    {
      name: "chatbot-store",
      partialize: (state) => ({
        sessions: state.sessions,
        activeChatId: state.activeChatId,
      }),
    }
  )
);
