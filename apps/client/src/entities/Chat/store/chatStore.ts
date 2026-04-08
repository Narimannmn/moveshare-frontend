import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";

interface ChatState {
  selectedConversationId: string | null;
  searchQuery: string;
}

interface ChatActions {
  selectConversation: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

type ChatStore = ChatState & {
  actions: ChatActions;
};

export const useChatStore = create<ChatStore>()(
  persist(
    devtools(
      (set) => ({
        // State
        selectedConversationId: null,
        searchQuery: "",

        // Actions namespace
        actions: {
          selectConversation: (id) => {
            set({ selectedConversationId: id });
          },

          setSearchQuery: (query) => {
            set({ searchQuery: query });
          },

          reset: () => {
            set({
              selectedConversationId: null,
              searchQuery: "",
            });
          },
        },
      }),
      { name: "ChatStore" }
    ),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedConversationId: state.selectedConversationId,
        // Don't persist searchQuery
      }),
    }
  )
);
