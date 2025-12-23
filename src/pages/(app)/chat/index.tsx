import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/chat/")({
  component: ChatListPage,
});

function ChatListPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#202224] mb-6">Chats</h1>
      {/* TODO: Add ChatList component */}
      <p className="text-sm text-gray-500">Chat list to be implemented</p>
    </div>
  );
}
