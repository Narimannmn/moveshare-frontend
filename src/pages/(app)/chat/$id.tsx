import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useChatStore } from "@/entities/Chat";
import { ConversationList, MessageThread, MessageInput } from "@/widgets/Chat";

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
    <div className="flex h-full">
      {/* Left sidebar - Conversation list */}
      <aside className="w-[320px] shrink-0 border-r border-gray-200 bg-white">
        <ConversationList />
      </aside>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-white">
        <MessageThread conversationId={id} className="flex-1" />
        <MessageInput conversationId={id} />
      </div>
    </div>
  );
}
