import { createFileRoute } from "@tanstack/react-router";
import { ConversationList } from "@/widgets/Chat";

export const Route = createFileRoute("/(app)/chat/")({
  component: ChatListPage,
});

function ChatListPage() {
  return <ConversationList />;
}
