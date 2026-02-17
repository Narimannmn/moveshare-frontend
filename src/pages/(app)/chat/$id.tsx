import { useEffect } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { useChatStore } from "@/entities/Chat";

import { ConversationList, MessageInput, MessageThread } from "@/widgets/Chat";

export const Route = createFileRoute("/(app)/chat/$id")({
  component: ChatDetailPage,
});

function ChatDetailPage() {
  const { id } = Route.useParams();
  const { actions } = useChatStore();

  useEffect(() => {
    actions.selectConversation(id);
  }, [id, actions]);

  return (
    <div className="flex flex-col gap-6 h-full">
      <h1 className="font-bold text-[24px] leading-[100%] text-[#202224] font-['Onest',sans-serif]">
        Chats
      </h1>
      <div className="bg-white rounded-lg p-4 flex-1 overflow-hidden flex gap-6">
        {/* Left sidebar - Conversation list */}
        <aside className="w-70 shrink-0">
          <ConversationList />
        </aside>

        {/* Vertical divider */}
        <div className="w-px bg-[#D8D8D8] self-stretch" />

        {/* Main chat area */}
        <div className="flex-1 flex flex-col min-w-0 justify-between">
          <MessageThread conversationId={id} className="flex-1 min-h-0" />
          <MessageInput conversationId={id} />
        </div>
      </div>
    </div>
  );
}
