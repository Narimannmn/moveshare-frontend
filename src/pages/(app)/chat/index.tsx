import { useEffect } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { MessageCircleOff } from "lucide-react";

import { EmptyState, useChatStore } from "@/entities/Chat";

import { ConversationList } from "@/widgets/Chat";

export const Route = createFileRoute("/(app)/chat/")({
  component: ChatListPage,
});

function ChatListPage() {
  const { actions } = useChatStore();

  useEffect(() => {
    actions.selectConversation(null);
  }, [actions]);

  return (
    <div className="flex flex-col gap-6 h-full">
      <h1 className="font-bold text-[24px] leading-[100%] text-[#202224] font-['Onest',sans-serif]">
        Chats
      </h1>
      <div className="bg-white rounded-lg p-4 flex-1 overflow-hidden flex gap-6">
        <aside className="w-70 h-full shrink-0">
          <ConversationList />
        </aside>

        {/* Vertical divider */}
        <div className="w-px bg-[#D8D8D8] self-stretch" />

        {/* Empty right panel when no chat is selected */}
        <div className="flex-1 min-w-0">
          <EmptyState
            icon={<MessageCircleOff />}
            title="No conversation selected"
            message="Select a conversation from the left to view messages"
          />
        </div>
      </div>
    </div>
  );
}
